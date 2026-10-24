import { Schema, model, Document, Types } from 'mongoose';


export interface IHistorialClub {
    clubId: Types.ObjectId;
    fechaInicio: Date;
    fechaFin?: Date | null;
    partidos: number;
}


export interface IEstadisticasGenerales {
    partidos: number;
    titularidades: number;
    minutos: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
}

export interface IEstadisticasOfensivas {
    goles: number;
    asistencias: number;
    xG: number;
    xA: number;
    tiros: number;
    tirosAlArco: number;
    regates: number;
}

export interface IEstadisticasPase {
    pasesCompletados: number;
    pasesClave: number;
    pasesProgresivos: number;
    ocasionesCreadas: number;
}

export interface IEstadisticasDefensivas {
    duelosGanados: number;
    intercepciones: number;
    recuperaciones: number;
    despejes: number;
    entradas: number;
}

export interface IEstadisticasGolero {
    atajadas: number;
    golesRecibidos: number;
    vallasInvictas: number;
    penalesAtajados: number;
    erroresQueTerminanEnGol: number;
    salidasExitosas: number;
}

export interface IEstadisticasDefensor {
    bloqueos: number;
    duelosAereosGanados: number;
}

export interface IEstadisticasMediocampista {
    regatesCompletados: number;
    duelosOfensivosGanados: number;
    pasesProgresivos: number;
    ocasionesCreadas: number;
}

export interface IEstadisticasDelantero {
    duelosOfensivosGanados: number;
    regatesCompletados: number;
}

export interface IEstadisticaTemporada {
    temporada: number;
    competicion: string;
    generales: IEstadisticasGenerales;
    ofensivas: IEstadisticasOfensivas;
    pase?: IEstadisticasPase;
    defensivas?: IEstadisticasDefensivas;
    golero?: IEstadisticasGolero;
    defensor?: IEstadisticasDefensor;
    mediocampista?: IEstadisticasMediocampista;
    delantero?: IEstadisticasDelantero;
}


export interface IHistorialLesion {
    tipo: string;
    fechaInicio: Date;
    fechaFin?: Date | null;
    diasInactividad: number;
    descripcion: string;
}


export interface IJugador extends Document {
    nombre: string;
    apellido: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    posiciones: string[];
    posicionPrincipal: string;
    altura: number;
    pieHabil: string;
    clubActualId: Types.ObjectId;
    historial_Clubes: IHistorialClub[];
    estadisticas_Temporadas: IEstadisticaTemporada[];
    historial_Lesiones: IHistorialLesion[];
}

const JugadorSchema = new Schema<IJugador>({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    nacionalidad: { type: String, required: true },
    posiciones: [{ type: String, required: true }],
    posicionPrincipal: { type: String, required: true },
    altura: { type: Number, required: true },
    pieHabil: { type: String, required: true },
    clubActualId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },

    historial_Clubes: [
        {
        clubId: { type: Schema.Types.ObjectId, ref: 'Club', 
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

export const JugadorModel = model<IJugador>('Jugador', JugadorSchema, 'JUGADOR');