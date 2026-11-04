// Conserva el día registrado, sin convertirlo a la zona horaria local.
export function formatearFechaNacimiento(fecha: string | undefined): string {
    const partes = fecha?.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    if (!partes) return 'Sin datos';
    const [, anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
}
