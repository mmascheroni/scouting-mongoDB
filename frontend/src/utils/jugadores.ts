export function formatearPieHabil(pie: string | undefined): string {
    return pie?.trim().toLowerCase() === 'zurdo' ? 'Izquierdo' : (pie || 'N/D');
}
