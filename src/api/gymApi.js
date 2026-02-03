const BASE_URL = "https://homothetic-dahlia-forfeitable.ngrok-free.dev";
const produccion = true ? "webhook" : "webhook-test";

const headers = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "69420"
};

export const gymApi = {
  /**
   * Obtiene el análisis de IA/Coach
   * @param {string} userId - ID del usuario de Supabase Auth
   */
  getStats: async (userId) => {
    // Enviamos el user_id como Query Parameter (?user_id=...)
    const response = await fetch(`${BASE_URL}/${produccion}/e4ae5042-fe39-4c6b-be5e-5b4d3e4af8db?user_id=${userId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error("Error en el GET de estadísticas (n8n)");
    return await response.json();
  },

  /**
   * Guarda una nueva serie en Supabase
   * @param {object} datosSerie - Objeto con los datos del ejercicio incluyendo user_id
   */
  registrarSerie: async (datosSerie) => {
    // Aquí el user_id ya va dentro del body JSON enviado desde App.js
    const response = await fetch(`${BASE_URL}/${produccion}/14ca8e92-5f62-4243-aa81-d9d002af93cd`, {
      method: 'POST',
      headers,
      body: JSON.stringify(datosSerie)
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error("Ejercicio no añadido en el diccionario, hable con el administrador");
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
    const response = await fetch(`${BASE_URL}/${produccion}/e0ab40d4-66f2-424b-b005-2e088d30328b?user_id=${userId}`, {
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
    const limit = 10;
    // Construimos la URL con todos los filtros necesarios para que Supabase sea eficiente
    const url = `${BASE_URL}/${produccion}/e9a2ba4b-8ad2-4a65-9320-8839a389fde6?ejercicio=${encodeURIComponent(ejercicio)}&rpe=${rpe}&page=${pagina}&limit=${limit}&user_id=${userId}`;

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
};