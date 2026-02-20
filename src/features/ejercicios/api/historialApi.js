import { BASE_URL, headers } from '../../../shared/api/client';

/**
 * Obtiene el historial detallado de un ejercicio específico con paginación
 * @param {string} ejercicio - Nombre del ejercicio
 * @param {number} rpe - Nivel de esfuerzo
 * @param {string} userId - ID del usuario de Supabase Auth
 * @param {number} pagina - Número de página para el historial
 */
export const getHistorialDetallado = async (ejercicio, rpe, userId, pagina = 1) => {
  const url = `${BASE_URL}analisis/historial_ejercicio?ejercicio=${encodeURIComponent(ejercicio)}&rpe_target=${rpe}&page=${pagina}&user_id=${userId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`Error de Red (${response.status})`);
  }

  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message || "Error al obtener el historial del ejercicio");
  }

  return result;
};
