const BASE_URL = import.meta.env.PROD ? VITE_HOST_PROD : import.meta.env.VITE_HOST_DEV;

const headers = {
  "Content-Type": "application/json",
};


export const gymApi = {
  /**
   * Obtiene el análisis de IA/Coach
   * @param {string} userId - ID del usuario de Supabase Auth
   */
  getStats: async (userId) => {
    // Enviamos el user_id como Query Parameter (?user_id=...)
    const response = await fetch(`${BASE_URL}analisis/progreso?user_id=${userId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error("Error en el GET de estadísticas (n8n)");
    return await response.json();
  },

  /**
   * Obtiene la lista de ejercicios agrupados y paginados
   * @param {number} page - Número de página para la paginación (default: 1)
   */
  getEjercicios: async (page = 1) => {
    console.log(`${BASE_URL}rendimiento/catalogo-ejercicios/?page=${page}`)

    const response = await fetch(`${BASE_URL}rendimiento/catalogo-ejercicios/?page=${page}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error("Error al obtener la lista de ejercicios (n8n)");
    }

    return await response.json();
  },

  /**
   * Guarda una nueva serie en Supabase
   * @param {object} datosSerie - Objeto con los datos del ejercicio incluyendo user_id
   */
  registrarSerie: async (datosSerie) => {
    // Aquí el user_id ya va dentro del body JSON enviado desde App.js
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
  },

  /**
   * Obtiene los récords personales (Mejor RM por Ejercicio/RPE)
   * @param {string} userId - ID del usuario de Supabase Auth
   */
  getRecords: async (userId) => {
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
  },

  /**
   * Obtiene el historial detallado de un ejercicio específico con paginación
   * @param {string} ejercicio - Nombre del ejercicio
   * @param {number} rpe - Nivel de esfuerzo
   * @param {string} userId - ID del usuario de Supabase Auth
   * @param {number} pagina - Número de página para el historial
   */
  getHistorialDetallado: async (ejercicio, rpe, userId, pagina = 1) => {
    // Construimos la URL con todos los filtros necesarios para que Supabase sea eficiente
    const url = `${BASE_URL}analisis/historial_ejercicio?ejercicio=${encodeURIComponent(ejercicio)}&rpe_target=${rpe}&page=${pagina}&user_id=${userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new Error("Webhook de historial no encontrado.");
        default:
          throw new Error(`Error cargando historial (${response.status})`);
      }
    }

    return await response.json();
  },


  /**
   * Obtiene el último registro realizado por el usuario
   * @param {string} userId - ID del usuario de Supabase Auth
   */
  getUltimoRegistro: async (userId) => {

    const response = await fetch(`${BASE_URL}analisis/ultimo_peso_corporal?user_id=${userId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo el último registro (${response.status})`);
    }

    const data = await response.json();

    // n8n suele devolver un array, si viene vacío significa que el usuario no tiene registros
    return Array.isArray(data) ? data[0] : data;
  },
};