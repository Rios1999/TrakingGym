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

  // 1. Verificación de Red
  if (!response.ok) throw new Error(`Error de Red (${response.status})`);

  const result = await response.json();

  // 2. Verificación de lógica Python
  if (result.status !== 'success') {
    throw new Error(result.message || "Error al obtener progreso");
  }

  return result;
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

  // 1. Verificación de Red
  if (!response.ok) {
    throw new Error(`Error de Red (${response.status})`);
  }

  const result = await response.json();

  // 2. Verificación de lógica Python
  if (result.status !== 'success') {
    throw new Error(result.message || "Error al cargar los récords");
  }

  return result;
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

  // 1. Verificación de Red
  if (!response.ok) {
    throw new Error(`Error de Red (${response.status})`);
  }

  const result = await response.json();

  // 2. Verificación de lógica Python
  if (result.status !== 'success') {
    throw new Error(result.message || "Error al obtener el peso corporal");
  }

  // Mantenemos tu lógica de limpiar el array si es necesario
  // Usamos result.data porque es donde suele venir la información en tu estructura
  const dataFinal = result.data || result; 
  return Array.isArray(dataFinal) ? dataFinal[0] : dataFinal;
};