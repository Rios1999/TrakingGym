import { BASE_URL, headers } from '../../../shared/api/client';

/**
 * Obtiene el análisis de IA/Coach
 * @param {string} userId - ID del usuario de Supabase Auth
 */
export const getStats = async (userId) => {
  const response = await fetch(`${BASE_URL}analisis/progreso?user_id=${userId}`, {
    method: 'GET',
    headers
  });
  if (!response.ok) throw new Error("Error en el GET de estadísticas (n8n)");
  return await response.json();
};

/**
 * Obtiene los récords personales (Mejor RM por Ejercicio/RPE)
 * @param {string} userId - ID del usuario de Supabase Auth
 */
export const getRecords = async (userId) => {
  const response = await fetch(`${BASE_URL}analisis/ver_records?user_id=${userId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error("Webhook de Records no encontrado. Verifica n8n.");
      default:
        throw new Error(`Error en el servidor de Records (${response.status})`);
    }
  }

  return await response.json();
};

/**
 * Obtiene el último registro realizado por el usuario
 * @param {string} userId - ID del usuario de Supabase Auth
 */
export const getUltimoRegistro = async (userId) => {
  const response = await fetch(`${BASE_URL}analisis/ultimo_peso_corporal?user_id=${userId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo el último registro (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
};
