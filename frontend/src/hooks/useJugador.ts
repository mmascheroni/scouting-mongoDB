import { useState, useEffect } from 'react';
import { getJugadorPorId } from '../services/jugadorService';
import type { IJugadorCompleto } from '../types/types';

export const useJugador = (id?: string) => {
    const [jugador, setJugador] = useState<IJugadorCompleto | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchJugador = async () => {
        try {
            setCargando(true);
            const data = await getJugadorPorId(id);
            setJugador(data);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Error al cargar la ficha del jugador.');
        } finally {
            setCargando(false);
        }
        };

        fetchJugador();
    }, [id]);

    return { jugador, cargando, error };
};