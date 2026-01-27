import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraficoProgreso = ({ records }) => {
  // 1. Extraer ejercicios únicos para los botones
  const listaEjercicios = useMemo(() => {
    if (!records) return [];
    return [...new Set(records.map(r => r.ejercicio))];
  }, [records]);

  // 2. Estado interno para el filtro (por defecto el primero de la lista)
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(
    listaEjercicios.length > 0 ? listaEjercicios[0] : ""
  );

  // Si records cambia (nueva consulta), actualizamos el seleccionado si es necesario
  useMemo(() => {
    if (listaEjercicios.length > 0 && !listaEjercicios.includes(ejercicioSeleccionado)) {
      setEjercicioSeleccionado(listaEjercicios[0]);
    }
  }, [listaEjercicios]);

  // 3. Filtrar datos para el gráfico
  const datosFiltrados = useMemo(() => {
    return records
      .filter(r => r.ejercicio === ejercicioSeleccionado)
      .sort((a, b) => {
        // Convertimos DD/MM/YYYY a un objeto Date comparable
        const [diaA, mesA, añoA] = a.fecha.split('/');
        const [diaB, mesB, añoB] = b.fecha.split('/');

        const fechaA = new Date(`${añoA}-${mesA}-${diaA}`);
        const fechaB = new Date(`${añoB}-${mesB}-${diaB}`);

        return fechaA - fechaB; // Orden ascendente (menor a mayor)
      });
  }, [records, ejercicioSeleccionado]);

  if (!records || records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Botones de Selección Internos */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {listaEjercicios.map((ej) => (
          <button
            key={ej}
            onClick={() => setEjercicioSeleccionado(ej)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${ejercicioSeleccionado === ej
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
          >
            {ej.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Contenedor del Gráfico */}
      <div className="w-full h-64 bg-zinc-900/20 p-4 rounded-xl border border-zinc-800 shadow-2xl">
        <h3 className="text-zinc-400 text-[10px] font-bold uppercase mb-4 tracking-widest">
          Tendencia: <span className="text-blue-500">{ejercicioSeleccionado}</span>
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="fecha"
              stroke="#71717a"
              fontSize={10}
              interval={0}
              padding={{ left: 7, right: 7 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => str.includes('-') ? str.split('-').reverse().join('/').slice(0, 5) : str.slice(0, 5)}
            />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              itemStyle={{ color: '#10b981' }}
              labelStyle={{ color: '#71717a' }}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoProgreso;