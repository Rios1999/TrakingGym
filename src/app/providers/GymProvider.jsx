import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { getRecords, getStats } from '../../features/analisis/api/analisisApi';
import { registrarSerie } from '../../features/ejercicios/api/ejerciciosApi';

const GymContext = createContext();

export const GymProvider = ({ children, userId }) => {
    const [data, setData] = useState({ records: [], stats: null });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [viewRecordsResponse, stats] = await Promise.all([
                getRecords(userId),
                getStats(userId)
            ]);

            setData({
                records: viewRecordsResponse.data || [],
                stats: stats || null
            });
        } catch (error) {
            console.error("Error cargando datos del gimnasio:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);


    const enviarDatos = async (formData) => {
        const nuevaMarca = await registrarSerie({
            ...formData,
            user_id: userId,
            peso: Number(formData.peso_kg),
            peso_corporal: Number(formData.peso_corporal),
            repeticiones: Number(formData.repeticiones),
            rpe: Number(formData.rpe),
            rm: Number(formData.rm)
        });



        if (nuevaMarca) {
            setData(prevData => {
                const listaActual = prevData?.records || [];

                // 1. Buscamos si ya existe el ejercicio en la lista
                const indexEjercicio = listaActual.findIndex(
                    item => item.ejercicio.toLowerCase() === nuevaMarca.ejercicio.toLowerCase()
                );

                let nuevasRecords;

                if (indexEjercicio !== -1) {
                    nuevasRecords = [...listaActual];

                    // Añadimos el nuevo registro al principio del array records_por_rpe de ese ejercicio
                    nuevasRecords[indexEjercicio] = {
                        ...nuevasRecords[indexEjercicio],
                        records_por_rpe: [
                            ...nuevaMarca.records_por_rpe,
                            ...(nuevasRecords[indexEjercicio].records_por_rpe || [])
                        ]
                    };
                } else {
                    const maxId = listaActual.length > 0
                        ? Math.max(...listaActual.map(r => r.id || 0))
                        : 0;

                    const nuevoBloque = {
                        id: maxId + 1,
                        ejercicio: nuevaMarca.ejercicio,
                        records_por_rpe: [...nuevaMarca.records_por_rpe]
                    };

                    // Lo añadimos al principio de la lista de records
                    nuevasRecords = [nuevoBloque, ...listaActual];
                }

                return {
                    ...prevData,
                    records: nuevasRecords
                };
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);


    return (
        <GymContext.Provider value={{ data, loading, enviarDatos }}>
            {children}
        </GymContext.Provider>
    );
};

export const useGym = () => useContext(GymContext);
