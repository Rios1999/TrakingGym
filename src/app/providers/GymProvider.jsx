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


        setData(prevData => ({
            ...prevData,
            records: [nuevaMarca, ...(prevData?.records || [])]
        }));
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
