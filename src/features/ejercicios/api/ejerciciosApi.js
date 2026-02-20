import { BASE_URL, headers } from '../../../shared/api/client';

/**
 * Obtiene la lista de ejercicios agrupados y paginados
 * @param {number} page - Número de página para la paginación (default: 1)
 */
export const getEjercicios = async (page = 1) => {
  console.log(`${BASE_URL}rendimiento/catalogo-ejercicios/?page=${page}`);
  const response = await fetch(`${BASE_URL}rendimiento/catalogo-ejercicios/?page=${page}`, {
    method: 'GET',
    headers
  });

  //comprobacion red
  if (!response.ok) {
    throw new Error(`Error de red: ${response.status}`);
  }

  const result = await response.json();

  //comprobacion negocio

  if (result.status != 'success') {
    throw new Error("Error al obtener la lista de ejercicios (n8n)");
  }

  return result
};

/**
 * Guarda una nueva serie en Supabase
 * @param {object} datosSerie - Objeto con los datos del ejercicio incluyendo user_id
 */
export const registrarSerie = async (datosSerie) => {
  const response = await fetch(`${BASE_URL}rendimiento/guardar_marca`, {
    method: 'POST',
    headers,
    body: JSON.stringify(datosSerie)
  });

  // 1. Verificación de Red / HTTP
  if (!response.ok) {
    throw new Error(`Error de red: ${response.status}`);
  }

  const result = await response.json();

  // 2. Verificación de lógica Python
  if (result.status !== 'success') {
    throw new Error(result.message || "No se pudo guardar la marca");
  }

  return result.data;
};

/**
 * Borra una serie en Supabase
 * @param {int} id - ID del registro a eliminar
 */
export const eliminarMarca = async (id) => {
  const response = await fetch(`${BASE_URL}rendimiento/borrar_marca`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id }) // Enviamos como objeto para que Pydantic lo lea bien
  });

  // 1. Verificación de Red
  if (!response.ok) {
    throw new Error(`Error de red al eliminar: ${response.status}`);
  }

  const result = await response.json();

  // 2. Verificación de lógica Python
  if (result.status !== 'success') {
    throw new Error(result.message || "Error al intentar eliminar la marca");
  }

  return result;
};