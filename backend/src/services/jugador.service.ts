import { Types } from 'mongoose';
import { JugadorModel, IJugador } from '../models/Jugador';

export class JugadorService {

    // =============================================================
    // CRUD BÁSICO
    // =============================================================

    static async crearJugador(datosJugador: Partial<IJugador>): Promise<IJugador> {
        const nuevoJugador = new JugadorModel(datosJugador);
        return await nuevoJugador.save();
    }

    static async obtenerTodos(): Promise<IJugador[]> {
        return await JugadorModel.find()
            .populate('clubActualId', 'nombre pais ciudad')
            .populate({
                path: 'historial_Clubes.clubId',
                select: 'nombre pais ciudad'
            })
            .lean();
    }

    static async obtenerPorId(id: string): Promise<IJugador | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await JugadorModel.findById(id)
            .populate('clubActualId', 'nombre pais ciudad')
            .populate({
                path: 'historial_Clubes.clubId',
                select: 'nombre pais ciudad'
            })
            .lean();
    }

    static async actualizarJugador(id: string, datos: Partial<IJugador>): Promise<IJugador | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await JugadorModel.findByIdAndUpdate(id, datos, { new: true }).lean();
    }

    static async eliminarJugador(id: string): Promise<IJugador | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await JugadorModel.findByIdAndDelete(id).lean();
    }

    // =============================================================
    // AGREGACIÓN 1: TRAYECTORIA GLOBAL Y POR JUGADOR ($lookup, $unwind)
    // =============================================================

    static async obtenerTrayectoriaClubesGlobal(): Promise<any[]> {
        return await JugadorModel.aggregate([
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
            { $unwind: '$historial_Clubes' },
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
    }

    static async obtenerTrayectoriaJugadorPorId(id: string): Promise<any | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const resultado = await JugadorModel.aggregate([
            // 1. Filtrar primero por el _id del jugador
            { $match: { _id: new Types.ObjectId(id) } },

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

        return resultado && resultado.length > 0 ? resultado[0] : null;
    }

    // =============================================================
    // AGREGACIÓN 2: EVOLUCIÓN MULTITEMPORADA ($unwind + $group)
    // =============================================================

    static async obtenerEvolucionJugador(id: string): Promise<any | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const resultado = await JugadorModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
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

        return resultado && resultado.length > 0 ? resultado[0] : null;
    }

    // =============================================================
    // AGREGACIÓN 3: RANKING AUTOMÁTICO DE SCOUTING ($match, $switch, $sort)
    // =============================================================

    static async obtenerRankingPorPosicion(posicion?: string, cantidad: number = 10, minGoles?: number): Promise<any[]> {
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

        // 7. Filtro opcional: si el usuario especifica minGoles
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

        return await JugadorModel.aggregate(pipeline);
    }

    // =============================================================
    // CONSULTA SCOUTING SIMPLE / ALTERNATIVA
    // =============================================================

    static async buscarScouting(posicion?: string, minGoles?: number): Promise<any[]> {
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

        return await JugadorModel.aggregate(pipeline);
    }

    // =============================================================
    // MANEJO DE HISTORIAL DE LESIONES (SUBDOCUMENTO EMBEBIDO)
    // =============================================================

    static async agregarLesion(id: string, nuevaLesion: any): Promise<IJugador | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await JugadorModel.findByIdAndUpdate(
            id,
            { $push: { historial_Lesiones: nuevaLesion } },
            { new: true, runValidators: true }
        );
    }

    static async obtenerLesionesJugador(id: string): Promise<{ nombre: string; apellido: string; lesiones: any[] } | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const jugador = await JugadorModel.findById(id, {
            nombre: 1,
            apellido: 1,
            historial_Lesiones: 1
        }).lean();

        if (!jugador) return null;

        return {
            nombre: jugador.nombre,
            apellido: jugador.apellido,
            lesiones: jugador.historial_Lesiones
        };
    }
}
