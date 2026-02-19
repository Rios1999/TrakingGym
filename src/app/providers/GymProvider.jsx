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

        if (nuevaMarca.status == 'success') {
            setData(prevData => {
                const listaActual = prevData?.data || [];

                // Calcular el máximo id de todos los records existentes
                const maxId = listaActual.length > 0 
                    ? Math.max(...listaActual.map(r => r.id || 0)) 
                    : 0;
                const nuevoId = maxId + 1;

                return {
                    ...prevData,
                    records: [
                        {
                            id: nuevoId,
                            ejercicio: nuevaMarca.ejercicio,
                            records_por_rpe: nuevaMarca.records_por_rpe
                        },
                        ...listaActual
                    ]
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
