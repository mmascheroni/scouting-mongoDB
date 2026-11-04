"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JugadorModel = void 0;
const mongoose_1 = require("mongoose");
const JugadorSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    nacionalidad: { type: String, required: true },
    posiciones: [{ type: String, required: true }],
    posicionPrincipal: { type: String, required: true },
    altura: { type: Number, required: true },
    pieHabil: { type: String, required: true },
    clubActualId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Club', required: true },
    historial_Clubes: [
        {
            clubId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Club',
                required: true },
            fechaInicio: { type: Date, required: true },
            fechaFin: { type: Date, default: null },
            partidos: { type: Number, default: 0 }
        }
    ],
    estadisticas_Temporadas: [
        {
            temporada: { type: Number, required: true },
            competicion: { type: String, required: true },
            generales: {
                partidos: { type: Number, default: 0 },
                titularidades: { type: Number, default: 0 },
                minutos: { type: Number, default: 0 },
                tarjetasAmarillas: { type: Number, default: 0 },
                tarjetasRojas: { type: Number, default: 0 }
            },
            ofensivas: {
                goles: { type: Number },
                asistencias: { type: Number },
                xG: { type: Number },
                xA: { type: Number },
                tiros: { type: Number },
                tirosAlArco: { type: Number },
                regates: { type: Number }
            },
            pase: {
                pasesCompletados: { type: Number },
                pasesClave: { type: Number },
                pasesProgresivos: { type: Number },
                ocasionesCreadas: { type: Number }
            },
            defensivas: {
                duelosGanados: { type: Number },
                intercepciones: { type: Number },
                recuperaciones: { type: Number },
                despejes: { type: Number },
                entradas: { type: Number }
            },
            golero: {
                atajadas: { type: Number },
                golesRecibidos: { type: Number },
                vallasInvictas: { type: Number },
                penalesAtajados: { type: Number },
                erroresQueTerminanEnGol: { type: Number },
                salidasExitosas: { type: Number }
            },
            defensor: {
                bloqueos: { type: Number },
                duelosAereosGanados: { type: Number }
            },
            mediocampista: {
                regatesCompletados: { type: Number },
                duelosOfensivosGanados: { type: Number },
                pasesProgresivos: { type: Number },
                ocasionesCreadas: { type: Number }
            },
            delantero: {
                duelosOfensivosGanados: { type: Number },
                regatesCompletados: { type: Number }
            }
        }
    ],
    historial_Lesiones: [
        {
            tipo: { type: String, required: true },
            fechaInicio: { type: Date, required: true },
            fechaFin: { type: Date, default: null },
            diasInactividad: { type: Number },
            descripcion: { type: String }
        }
    ]
});
exports.JugadorModel = (0, mongoose_1.model)('Jugador', JugadorSchema, 'JUGADOR');
