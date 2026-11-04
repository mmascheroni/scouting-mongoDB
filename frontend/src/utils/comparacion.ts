// Comparamos con la misma precisión que los valores visibles en la tabla.
export function valorMasFavorable(a: number | undefined, b: number | undefined, menorEsMejor = false): 'primero' | 'segundo' | undefined {
    if (a === undefined || b === undefined || !Number.isFinite(a) || !Number.isFinite(b)) return undefined;
    const primero = Number(a.toFixed(2));
    const segundo = Number(b.toFixed(2));
    if (primero === segundo) return undefined;
    return (menorEsMejor ? primero < segundo : primero > segundo) ? 'primero' : 'segundo';
}
