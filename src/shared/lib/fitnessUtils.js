/**
 * Calcula el 1RM estimado usando la fórmula de Epley
 * @param {string} ejercicio - Nombre del ejercicio
 * @param {number|string} peso - Peso en la barra o lastre
 * @param {number|string} tuPeso - Peso corporal del usuario
 * @param {number|string} reps - Repeticiones realizadas
 * @returns {string} - RM calculado con un decimal
 */
export const calcularRmEpley = (tiene_carga, peso, tuPeso, reps , rpe) => {
    const pBarra = parseFloat(peso) || 0;
    const pCuerpo = parseFloat(tuPeso) || 0;
    const r = parseInt(reps) || 0;
    const rp = parseFloat(rpe) || 0;

    const rVirtuales = (r + (10 - rp))
    
    const pesoEfectivo = tiene_carga ? (pBarra + pCuerpo) : pBarra;

    if (pesoEfectivo > 0 && r > 0) {
        return (pesoEfectivo * (1 + rVirtuales / 30)).toFixed(1);
    }
    
    return "0.0";
};
