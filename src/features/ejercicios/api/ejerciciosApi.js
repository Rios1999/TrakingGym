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

  if (!response.ok) {
    throw new Error("Error al obtener la lista de ejercicios (n8n)");
  }

  return await response.json();
};

/**
 * Guarda una nueva serie en Supabase
 * @param {object} datosSerie - Objeto con los datos del ejercicio incluyendo user_id
 */
export const registrarSerie = async (datosSerie) => {
  const response = await fetch(`${BASE_URL}rendimiento/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(datosSerie)
  });

  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error("Este ejercio no esta disponible, hable con el administrador");
      default:
        throw new Error("Error al registrar la serie en n8n");
    }
  }

  return await response.json();
};
