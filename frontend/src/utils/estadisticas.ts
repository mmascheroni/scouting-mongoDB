export function porPartido(total: number | undefined, partidos: number | undefined): number | undefined {
    if (total === undefined || partidos === undefined || !Number.isFinite(total) || !Number.isFinite(partidos) || partidos <= 0) return undefined;
    return total / partidos;
}

export function formatearPorPartido(total: number | undefined, partidos: number | undefined): string {
    const promedio = porPartido(total, partidos);
    return promedio === undefined ? 'Sin datos' : promedio.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
