import { Request, Response } from 'express';
import { JugadorModel } from '../models/Jugador';
import mongoose from 'mongoose';


export const obtenerJugadores = async (req: Request, res: Response) => {
    try {
        const jugadores = await JugadorModel.find()
        .populate('clubActualId', 'nombre pais ciudad')
        .populate({
            path: 'historial_Clubes.clubId',
            select: 'nombre pais ciudad'
        })
        .lean();

        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores' });
    }
};


export const obtenerJugadorPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const jugador = await JugadorModel.findById(id)
        .populate('clubActualId', 'nombre pais ciudad')
        .populate({
            path: 'historial_Clubes.clubId',
            select: 'nombre pais ciudad'
        })
        .lean();
        
        if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });
        res.json(jugador);
    } catch (error) {
        res.status(400).json({ error: 'ID inválido' });
    }
};

// 3. CONSULTA 4.1: TRAYECTORIA Y CRUCE DE CLUBES ($lookup)
export const obtenerTrayectoriaClubes = async (req: Request, res: Response) => {
    try {
    const resultado = await JugadorModel.aggregate([
        {
            $lookup: {
                from: 'CLUB',
                localField: 'clubActualId',
                foreignField: '_id',
                as: 'clubActualInfo'
            }
        },
        {
            $unwind: {
                path: '$clubActualInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        // B. Unwind del Historial de Clubes
        { $unwind: '$historial_Clubes' },
        // C. Lookup para el Historial
        {
            $lookup: {
                from: 'CLUB',
                localField: 'historial_Clubes.clubId',
                foreignField: '_id',
                as: 'detalleClubHistorial'
            }
        },
        {
            $unwind: {
                path: '$detalleClubHistorial',
                preserveNullAndEmptyArrays: true
            }
        },
        // D. Agrupar manteniendo la estructura enriquecida
        {
            $group: {
                _id: '$_id',
                nombre: { $first: '$nombre' },
                apellido: { $first: '$apellido' },
                posicionPrincipal: { $first: '$posicionPrincipal' },
                clubActual: {
                    $first: {
                    _id: '$clubActualInfo._id',
                    nombre: '$clubActualInfo.nombre',
                    ciudad: '$clubActualInfo.ciudad'
                    }
            },
            historial_Clubes: {
                $push: {
                    _id: '$historial_Clubes._id',
                    clubId: '$historial_Clubes.clubId',
                    nombreClub: '$detalleClubHistorial.nombre',
                    paisClub: '$detalleClubHistorial.pais',
                    ciudadClub: '$detalleClubHistorial.ciudad',
                    fechaInicio: '$historial_Clubes.fechaInicio',
                    fechaFin: '$historial_Clubes.fechaFin',
                    partidos: '$historial_Clubes.partidos'
                }
            }
            }
        }
        ]);

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la trayectoria global' });
    }
};

export const obtenerTrayectoriaJugadorPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de jugador no válido' });
        }

        const resultado = await JugadorModel.aggregate([
        // 1. Filtrar primero por el _id del jugador
        { $match: { _id: new mongoose.Types.ObjectId(id) } },

        // 2. Lookup del Club Actual (Colección "CLUB")
        {
            $lookup: {
            from: 'CLUB',
            localField: 'clubActualId',
            foreignField: '_id',
            as: 'clubActualInfo'
            }
        },

        // 3. Unwind del Historial de Clubes (preserva jugadores aunque no tengan historial)
        {
            $unwind: {
            path: '$historial_Clubes',
            preserveNullAndEmptyArrays: true
            }
        },

        // 4. Lookup de cada club del Historial (Colección "CLUB")
        {
            $lookup: {
            from: 'CLUB',
            localField: 'historial_Clubes.clubId',
            foreignField: '_id',
            as: 'detalleClubHistorial'
            }
        },
        {
            $unwind: {
            path: '$detalleClubHistorial',
            preserveNullAndEmptyArrays: true
            }
        },

        // 5. Agrupar manteniendo la estructura enriquecida
        {
            $group: {
            _id: '$_id',
            nombre: { $first: '$nombre' },
            apellido: { $first: '$apellido' },
            posicionPrincipal: { $first: '$posicionPrincipal' },
            clubActualData: { $first: { $arrayElemAt: ['$clubActualInfo', 0] } },
            historial_Clubes: {
                $push: {
                $cond: [
                    { $gt: ['$historial_Clubes._id', null] },
                    {
                    _id: '$historial_Clubes._id',
                    clubId: '$historial_Clubes.clubId',
                    nombreClub: '$detalleClubHistorial.nombre',
                    paisClub: '$detalleClubHistorial.pais',
                    ciudadClub: '$detalleClubHistorial.ciudad',
                    estadioClub: '$detalleClubHistorial.estadio',
                    fechaInicio: '$historial_Clubes.fechaInicio',
                    fechaFin: '$historial_Clubes.fechaFin',
                    partidos: '$historial_Clubes.partidos'
                    },
                    '$$REMOVE'
                ]
                }
            }
            }
        },

        // 6. Proyección final limpia (sin objetos vacíos)
        {
            $project: {
            _id: 1,
            nombre: 1,
            apellido: 1,
            posicionPrincipal: 1,
            clubActual: {
                $cond: [
                { $gt: ['$clubActualData._id', null] },
                {
                    _id: '$clubActualData._id',
                    nombre: '$clubActualData.nombre',
                    pais: '$clubActualData.pais',
                    ciudad: '$clubActualData.ciudad',
                    estadio: '$clubActualData.estadio'
                },
                null
                ]
            },
            historial_Clubes: 1
            }
        }
        ]);

        if (!resultado || resultado.length === 0) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(resultado[0]);
    } catch (error) {
        console.error('Error al consultar trayectoria por ID:', error);
        res.status(500).json({ error: 'Error interno al consultar la trayectoria del jugador' });
    }
};

// 4. CONSULTA 4.2: EVOLUCIÓN MULTITEMPORADA ($unwind + $group)
export const obtenerEvolucionJugador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'El ID provisto no es un ObjectId válido' });
        }

        const resultado = await JugadorModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: '$estadisticas_Temporadas' },
        {
            $group: {
            _id: '$_id',
            nombre: { $first: '$nombre' },
            apellido: { $first: '$apellido' },
            totalPartidos: { $sum: '$estadisticas_Temporadas.generales.partidos' },
            totalMinutos: { $sum: '$estadisticas_Temporadas.generales.minutos' },
            promedioGoles: { $avg: '$estadisticas_Temporadas.ofensivas.goles' },
            temporadasEvaluadas: { $push: '$estadisticas_Temporadas' }
            }
        }
        ]);

        if (!resultado.length) return res.status(404).json({ error: 'Jugador no encontrado' });
        res.json(resultado[0]);
    } catch (error) {
        res.status(400).json({ error: 'Error en la agregación de evolución' });
    }
};

// 5. CONSULTA 4.3: SCOUTING FILTRADO ($match + $sort)
export const buscarScouting = async (req: Request, res: Response) => {
    try {
        const { posicion, minGoles } = req.query;

        const pipeline: any[] = [];

        if (posicion) {
            pipeline.push({ $match: { posicionPrincipal: String(posicion).toUpperCase() } });
        }

        pipeline.push({ $unwind: '$estadisticas_Temporadas' });

        if (minGoles) {
        pipeline.push({
            $match: { 'estadisticas_Temporadas.ofensivas.goles': { $gte: Number(minGoles) } }
        });
        }

        pipeline.push({
            $sort: { 'estadisticas_Temporadas.ofensivas.goles': -1 }
        });

        const resultado = await JugadorModel.aggregate(pipeline);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error en la consulta de scouting' });
    }
};

// 6. AGREGAR LESIÓN ($push)
export const agregarLesion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const nuevaLesion = req.body;

        const jugadorActualizado = await JugadorModel.findByIdAndUpdate(
        id,
        { $push: { historial_Lesiones: nuevaLesion } },
        { new: true }
        );

        res.json(jugadorActualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar lesión' });
    }
};

export const obtenerLesionesJugador = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
        }

        const jugador = await JugadorModel.findById(id, { nombre: 1, apellido: 1, historial_Lesiones: 1 }).lean();
        if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });

        res.json({
        nombre: jugador.nombre,
        apellido: jugador.apellido,
        lesiones: jugador.historial_Lesiones
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener lesiones' });
    }
};

export const crearJugador = async (req: Request, res: Response) => {
    try {
        const nuevoJugador = await JugadorModel.create(req.body);
        res.status(201).json(nuevoJugador);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear jugador' });
    }
};

export const eliminarJugador = async (req: Request, res: Response) => {
    try {
        await JugadorModel.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Jugador eliminado' });
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
};

export const obtenerRanking = async (req: Request, res: Response) => {
    try {
        const { posicion, minGoles, cantidad } = req.query;
        
        // Posición por defecto si no se envía una
        const pos = posicion ? String(posicion).toUpperCase() : 'DELANTERO';
        const limitNum = cantidad ? Number(cantidad) : 10;

        const pipeline: any[] = [
        // 1. Filtrar los jugadores por la posición elegida
        { $match: { posiciones: pos } },
        
        // 2. Descomponer el historial de temporadas
        { $unwind: '$estadisticas_Temporadas' },
        
        // 3. Ordenar para obtener la temporada más reciente primero
        { $sort: { 'estadisticas_Temporadas.temporada': -1 } },
        
        // 4. Agrupar para conservar solo la última temporada disputada por cada jugador
        {
            $group: {
            _id: '$_id',
            nombre: { $first: '$nombre' },
            apellido: { $first: '$apellido' },
            posicionPrincipal: { $first: '$posicionPrincipal' },
            clubActualId: { $first: '$clubActualId' },
            temporada: { $first: '$estadisticas_Temporadas' }
            }
        },
        
        // 5. Lookup para obtener la información del club actual
        {
            $lookup: {
            from: 'CLUB', // Nombre de la colección tal cual figura en MongoDB
            localField: 'clubActualId',
            foreignField: '_id',
            as: 'clubActualInfo'
            }
        },
        {
            $unwind: {
            path: '$clubActualInfo',
            preserveNullAndEmptyArrays: true
            }
        },

        // 6. AUTOMÁTICO: Asignar el criterio principal según la posición
        {
            $addFields: {
            criterioPrincipal: {
                $switch: {
                branches: [
                    {
                    case: { $eq: [pos, 'GOLERO'] },
                    then: { $ifNull: ['$temporada.golero.vallasInvictas', 0] }
                    },
                    {
                    case: { $eq: [pos, 'DEFENSOR'] },
                    then: { $ifNull: ['$temporada.defensivas.duelosGanados', 0] }
                    },
                    {
                    case: { $eq: [pos, 'MEDIOCAMPISTA'] },
                    then: { $ifNull: ['$temporada.pase.pasesProgresivos', 0] }
                    },
                    {
                    case: { $eq: [pos, 'DELANTERO'] },
                    then: { $ifNull: ['$temporada.ofensivas.goles', 0] }
                    }
                ],
                default: 0
                }
            }
            }
        }
        ];

        // 7. Filtro opcional: si el usuario especifica minGoles (útil para delanteros/medios)
        if (minGoles && Number(minGoles) > 0) {
        pipeline.push({
            $match: { 'temporada.ofensivas.goles': { $gte: Number(minGoles) } }
        });
        }

        // 8. Ordenar descendentemente por la métrica automática asignada
        pipeline.push({ $sort: { criterioPrincipal: -1 } });

        // 9. Limitar el número de resultados (Top N)
        pipeline.push({ $limit: limitNum });

        // 10. Proyectar la salida de forma limpia
        pipeline.push({
        $project: {
            _id: 1,
            jugador: { $concat: ['$nombre', ' ', '$apellido'] },
            nombre: 1,
            apellido: 1,
            posicionPrincipal: 1,
            clubActual: '$clubActualInfo.nombre',
            temporada: '$temporada.temporada',
            partidos: '$temporada.generales.partidos',
            criterioPrincipal: 1,
            estadisticas: '$temporada'
        }
        });

        const ranking = await JugadorModel.aggregate(pipeline);
        res.json(ranking);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al generar el ranking por posición' });
    }
};