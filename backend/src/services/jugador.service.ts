import { JugadorModel, IJugador } from '../models/Jugador';
import { Types } from 'mongoose';

export class JugadorService {

    static async crearJugador(datosJugador: Partial<IJugador>): Promise<IJugador> {
        const nuevoJugador = new JugadorModel(datosJugador);
        return await nuevoJugador.save();
    }

    static async obtenerTodos(): Promise<IJugador[]> {
        // .lean() para optimizar la lectura devolviendo JSON plano
        return await JugadorModel.find().lean();
    }

    static async obtenerPorId(id: string): Promise<IJugador | null> {
        return await JugadorModel.findById(id).lean();
    }

    static async actualizarJugador(id: string, datos: Partial<IJugador>): Promise<IJugador | null> {
        return await JugadorModel.findByIdAndUpdate(id, datos, { new: true }).lean();
    }

    static async eliminarJugador(id: string): Promise<IJugador | null> {
        return await JugadorModel.findByIdAndDelete(id).lean();
    }


    static async obtenerTrayectoriaJugador(jugadorId: string) {
        return await JugadorModel.aggregate([
        { $match: { _id: new Types.ObjectId(jugadorId) } },
        { $unwind: '$historial_Clubes' },
        {
            $lookup: {
            from: 'CLUB',
            localField: 'historial_Clubes.clubId',
            foreignField: '_id',
            as: 'club'
            }
        },
        { $unwind: '$club' },
        { $sort: { 'historial_Clubes.fechaInicio': 1 } },
        {
            $project: {
            _id: 0,
            jugador: { $concat: ['$nombre', ' ', '$apellido'] },
            club: '$club.nombre',
            fechaInicio: '$historial_Clubes.fechaInicio',
            fechaFin: '$historial_Clubes.fechaFin',
            partidos: '$historial_Clubes.partidos'
            }
        }
        ]);
    }

    static async obtenerEvolucionEstadistica(jugadorId: string) {
        return await JugadorModel.aggregate([
        { $match: { _id: new Types.ObjectId(jugadorId) } },
        { $unwind: '$estadisticas_Temporadas' },
        { $sort: { 'estadisticas_Temporadas.temporada': 1 } },
        {
            $project: {
            _id: 0,
            jugador: { $concat: ['$nombre', ' ', '$apellido'] },
            posicionPrincipal: 1,
            temporada: '$estadisticas_Temporadas.temporada',
            partidos: '$estadisticas_Temporadas.generales.partidos',
            titularidades: '$estadisticas_Temporadas.generales.titularidades',
            minutos: '$estadisticas_Temporadas.generales.minutos',
            goles: '$estadisticas_Temporadas.ofensivas.goles',
            asistencias: '$estadisticas_Temporadas.ofensivas.asistencias',
            estadisticasEspecificas: {
                $switch: {
                branches: [
                    { case: { $eq: ['$posicionPrincipal', 'GOLERO'] }, then: '$estadisticas_Temporadas.golero' },
                    { case: { $eq: ['$posicionPrincipal', 'DEFENSOR'] }, then: '$estadisticas_Temporadas.defensor' },
                    { case: { $eq: ['$posicionPrincipal', 'MEDIOCAMPISTA'] }, then: '$estadisticas_Temporadas.mediocampista' },
                    { case: { $eq: ['$posicionPrincipal', 'DELANTERO'] }, then: '$estadisticas_Temporadas.delantero' }
                ],
                default: null
                }
            }
            }
        }
        ]);
    }

    static async obtenerRankingPorPosicion(posicion: string, cantidad: number = 10) {
        return await JugadorModel.aggregate([
        { $match: { posiciones: posicion } },
        { $unwind: '$estadisticas_Temporadas' },
        { $sort: { 'estadisticas_Temporadas.temporada': -1 } },
        {
            $group: {
            _id: '$_id',
            nombre: { $first: '$nombre' },
            apellido: { $first: '$apellido' },
            posiciones: { $first: '$posiciones' },
            temporada: { $first: '$estadisticas_Temporadas' }
            }
        },
        {
            $addFields: {
            criterioPrincipal: {
                $switch: {
                branches: [
                    { case: { $eq: [posicion, 'GOLERO'] }, then: '$temporada.golero.vallasInvictas' },
                    { case: { $eq: [posicion, 'DEFENSOR'] }, then: '$temporada.defensivas.duelosGanados' },
                    { case: { $eq: [posicion, 'MEDIOCAMPISTA'] }, then: '$temporada.pase.pasesProgresivos' },
                    { case: { $eq: [posicion, 'DELANTERO'] }, then: '$temporada.ofensivas.goles' }
                ],
                default: 0
                }
            }
            }
        },
        { $sort: { criterioPrincipal: -1 } },
        { $limit: cantidad },
        {
            $project: {
            _id: 0,
            jugador: { $concat: ['$nombre', ' ', '$apellido'] },
            posicion: posicion,
            temporada: '$temporada.temporada',
            partidos: '$temporada.generales.partidos',
            criterioPrincipal: 1,
            estadisticas: {
                $switch: {
                branches: [
                    { case: { $eq: [posicion, 'GOLERO'] }, then: '$temporada.golero' },
                    {
                    case: { $eq: [posicion, 'DEFENSOR'] },
                    then: {
                        duelosGanados: '$temporada.defensivas.duelosGanados',
                        intercepciones: '$temporada.defensivas.intercepciones',
                        duelosAereosGanados: '$temporada.defensor.duelosAereosGanados',
                        bloqueos: '$temporada.defensor.bloqueos'
                    }
                    },
                    {
                    case: { $eq: [posicion, 'MEDIOCAMPISTA'] },
                    then: {
                        pasesCompletados: '$temporada.pase.pasesCompletados',
                        pasesClave: '$temporada.pase.pasesClave',
                        pasesProgresivos: '$temporada.pase.pasesProgresivos',
                        ocasionesCreadas: '$temporada.pase.ocasionesCreadas',
                        asistencias: '$temporada.ofensivas.asistencias',
                        recuperaciones: '$temporada.defensivas.recuperaciones'
                    }
                    },
                    {
                    case: { $eq: [posicion, 'DELANTERO'] },
                    then: {
                        goles: '$temporada.ofensivas.goles',
                        asistencias: '$temporada.ofensivas.asistencias',
                        xG: '$temporada.ofensivas.xG',
                        tirosAlArco: '$temporada.ofensivas.tirosAlArco',
                        regates: '$temporada.ofensivas.regates'
                    }
                    }
                ],
                default: {}
                }
            }
            }
        }
        ]);
    }
}