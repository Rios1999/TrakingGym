const BASE_URL = "https://homothetic-dahlia-forfeitable.ngrok-free.dev";
const produccion = false ? "webhook" : "webhook-test"

const headers = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "69420"
};

export const gymApi = {
  // Función para obtener datos (GET)
  getStats: async () => {
    const response = await fetch(`${BASE_URL}/${produccion}/e0ab40d4-66f2-424b-b005-2e088d30328b`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error("Error en el GET de n8n");
    return await response.json();
  },

  // Función para enviar datos (POST)
  registrarSerie: async (datosSerie) => {
    const response = await fetch(`${BASE_URL}/${produccion}/14ca8e92-5f62-4243-aa81-d9d002af93cd`, {
      method: 'POST',
      headers,
      body: JSON.stringify(datosSerie)
    });
    console.log(response)
    if (!response.ok) {
      
        switch(response.status){
          case 400:
            throw new Error("Ejercicio no añadido en el diccionario, hable con el administrador");
          default:
            throw new Error("Error en el GET de n8n");
      }
    }

      
    return await response.json()
  }
};