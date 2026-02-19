import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { gymApi } from '../api/gymApi';

const GymContext = createContext();

export const GymProvider = ({ children, userId }) => {
    const [data, setData] = useState({ records: [], stats: null });
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        
        if (!userId) return;
        setLoading(true);
        try {
            const [viewRecordsResponse, stats] = await Promise.all([
                gymApi.getRecords(userId),
                //gymApi.getStats(userId)
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
        // Enviamos todo el objeto incluyendo explícitamente el user_id
        const nuevaMarca = await gymApi.registrarSerie({
            ...formData,
            user_id: userId, // ID proveniente de Supabase Auth
            peso: Number(formData.peso_kg),
            peso_corporal: Number(formData.peso_corporal),
            repeticiones: Number(formData.repeticiones),
            rpe: Number(formData.rpe),
            rm: Number(formData.rm)
        });


        setData(prevData => ({
            ...prevData,
            // Añadimos el nuevo récord al principio de la lista
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