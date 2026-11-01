import { useState, useEffect } from 'react';
import { getRankingScouting } from '../services/jugadorService';

export const useRankingScouting = (posicionInicial: string = 'DELANTERO', cantidadInicial: number = 10) => {
    const [posicion, setPosicion] = useState<string>(posicionInicial);
    const [cantidad, setCantidad] = useState<number>(cantidadInicial);
    const [ranking, setRanking] = useState<any[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const buscarRanking = async (nuevaPosicion?: string, nuevaCantidad?: number) => {
        const pos = nuevaPosicion || posicion;
        const cant = nuevaCantidad || cantidad;

        try {
        setCargando(true);
        setError(null);
        const data = await getRankingScouting(pos, cant);
        setRanking(data);
        } catch (err: any) {
        setError('Error al obtener el ranking de scouting.');
        } finally {
        setCargando(false);
        }
    };

    useEffect(() => {
        buscarRanking();
    }, [posicion, cantidad]);

    return {
        posicion,
        setPosicion,
        cantidad,
        setCantidad,
        ranking,
        cargando,
        error,
        refetch: buscarRanking,
    };
};