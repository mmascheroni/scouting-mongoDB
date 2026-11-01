import { useState, useEffect } from 'react';
import { getClubes } from '../services/clubService';
import type { IClub } from '../types/types';

export const useClubes = () => {
    const [clubes, setClubes] = useState<IClub[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClubes = async () => {
        try {
            setCargando(true);
            const data = await getClubes();
            setClubes(data);
        } catch (err: any) {
            setError(err?.message || 'Error al conectar con la API de clubes');
        } finally {
            setCargando(false);
        }
        };

        fetchClubes();
    }, []);

    return { clubes, cargando, error };
};