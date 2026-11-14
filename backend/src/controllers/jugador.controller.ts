import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { JugadorService } from '../services/jugador.service';

// 1. LISTADO GENERAL
export const obtenerJugadores = async (req: Request, res: Response) => {
    try {
        const jugadores = await JugadorService.obtenerTodos();
        res.json(jugadores);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener jugadores', detalle: error.message });
    }
};

// 2. DETALLE DE JUGADOR POR ID
export const obtenerJugadorPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const jugador = await JugadorService.obtenerPorId(id);
        if (!jugador) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(jugador);
    } catch (error: any) {
        res.status(400).json({ error: 'Error al obtener el jugador', detalle: error.message });
    }
};

// 3. CONSULTA 4.1: TRAYECTORIA GLOBAL ($lookup)
export const obtenerTrayectoriaClubes = async (req: Request, res: Response) => {
    try {
        const resultado = await JugadorService.obtenerTrayectoriaClubesGlobal();
        res.json(resultado);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la trayectoria global', detalle: error.message });
    }
};

// 4. CONSULTA 4.1: TRAYECTORIA DE JUGADOR POR ID ($lookup)
export const obtenerTrayectoriaJugadorPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID de jugador no válido' });
        }

        const resultado = await JugadorService.obtenerTrayectoriaJugadorPorId(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(resultado);
    } catch (error: any) {
        console.error('Error al consultar trayectoria por ID:', error);
        res.status(500).json({ error: 'Error interno al consultar la trayectoria del jugador', detalle: error.message });
    }
};

// 5. CONSULTA 4.2: EVOLUCIÓN MULTITEMPORADA ($unwind + $group)
export const obtenerEvolucionJugador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'El ID provisto no es un ObjectId válido' });
        }

        const resultado = await JugadorService.obtenerEvolucionJugador(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(resultado);
    } catch (error: any) {
        res.status(400).json({ error: 'Error en la agregación de evolución', detalle: error.message });
    }
};

// 6. CONSULTA SCOUTING SIMPLE ($match + $sort)
export const buscarScouting = async (req: Request, res: Response) => {
    try {
        const { posicion, minGoles } = req.query;
        const resultado = await JugadorService.buscarScouting(
            posicion ? String(posicion) : undefined,
            minGoles ? Number(minGoles) : undefined
        );
        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ error: 'Error en la consulta de scouting', detalle: error.message });
    }
};

// 7. CONSULTA 4.3: RANKING AUTOMÁTICO DE SCOUTING ($match, $switch, $sort, $limit)
export const obtenerRanking = async (req: Request, res: Response) => {
    try {
        const { posicion, minGoles, cantidad } = req.query;
        const pos = posicion ? String(posicion) : 'DELANTERO';
        const limitNum = cantidad ? Number(cantidad) : 10;
        const minGolesNum = minGoles ? Number(minGoles) : undefined;

        const ranking = await JugadorService.obtenerRankingPorPosicion(pos, limitNum, minGolesNum);
        res.json(ranking);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al generar el ranking por posición', detalle: error.message });
    }
};

// 8. AGREGAR LESIÓN ($push)
export const agregarLesion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const jugadorActualizado = await JugadorService.agregarLesion(id as string, req.body);
        if (!jugadorActualizado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(jugadorActualizado);
    } catch (error: any) {
        res.status(400).json({ error: 'Error al registrar lesión', detalle: error.message });
    }
};

// 9. OBTENER LESIONES DE JUGADOR
export const obtenerLesionesJugador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const resultado = await JugadorService.obtenerLesionesJugador(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener lesiones', detalle: error.message });
    }
};

// 10. CREAR JUGADOR (CRUD)
export const crearJugador = async (req: Request, res: Response) => {
    try {
        const nuevoJugador = await JugadorService.crearJugador(req.body);
        res.status(201).json(nuevoJugador);
    } catch (error: any) {
        res.status(400).json({ error: 'Error al crear jugador', detalle: error.message });
    }
};

// 11. ELIMINAR JUGADOR (CRUD)
export const eliminarJugador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const eliminado = await JugadorService.eliminarJugador(id);
        if (!eliminado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json({ mensaje: 'Jugador eliminado', jugador: eliminado });
    } catch (error: any) {
        res.status(400).json({ error: 'Error al eliminar', detalle: error.message });
    }
};
