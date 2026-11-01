import api from '../api/axiosConfig';
import type { IJugadorCompleto, IHistorialLesion, ITrayectoriaJugador } from '../types/types';

export const getJugadores = async (): Promise<IJugadorCompleto[]> => {
    const response = await api.get<IJugadorCompleto[]>('/jugadores');
    return response.data;
};

// GET /api/jugadores/:id (Ficha Completa)
export const getJugadorPorId = async (id: string): Promise<IJugadorCompleto> => {
    const response = await api.get<IJugadorCompleto>(`/jugadores/${id}`);
    return response.data;
};

export const getTrayectoriasGlobales = async (): Promise<ITrayectoriaJugador[]> => {
    const response = await api.get<ITrayectoriaJugador[]>('/jugadores/trayectoria');
    return response.data;
};

// GET /api/jugadores/:id/trayectoria (Agregación 4.1)
export const getTrayectoriaJugador = async (id: string) => {
    const response = await api.get(`/jugadores/${id}/trayectoria`);
    return response.data;
};

// GET /api/jugadores/scouting (Agregación 4.3)
export const getRankingScouting = async (posicion?: string, minGoles?: number) => {
    const response = await api.get('/jugadores/scouting', {
        params: { posicion, minGoles }
    });
    return response.data;
};

// POST /api/jugadores/:id/lesiones (Registrar lesión)
export const agregarLesionJugador = async (id: string, lesion: IHistorialLesion) => {
    const response = await api.post(`/jugadores/${id}/lesiones`, lesion);
    return response.data;
};