// Interface para el Club
export interface IClub {
    _id: string;
    nombre: string;
    division: string;
    pais: string;
    ciudad: string;
    estadio?: string;
}

// Interface para la Plantilla del Club (Home -> Vista de Club)
export interface IJugadorResumen {
    _id: string;
    nombre: string;
    apellido: string;
    posicionPrincipal: string;
    posiciones: string[];
    fechaNacimiento: string;
    altura: number;
    pieHabil: string;
}

export interface IPlantillaClubResponse {
    club: IClub;
    plantilla: IJugadorResumen[];
}


export interface IHistorialClubDetalle {
    _id: string;
    clubId: string;
    nombreClub: string;
    paisClub?: string;
    ciudadClub?: string;
    fechaInicio: string;
    fechaFin?: string | null;
    partidos: number;
}

export interface IHistorialLesion {
    _id?: string;
    tipo: string;
    fechaInicio: string;
    fechaFin?: string | null;
    diasInactividad: number;
    descripcion: string;
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

// Subdocumentos según la Posición Específica
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

// Estructura de cada Temporada dentro del array estadisticas_Temporadas
export interface IEstadisticaTemporada {
    _id?: string;
    temporada: number;
    competicion: string;
    generales: IEstadisticasGenerales;
    ofensivas?: IEstadisticasOfensivas;
    pase?: IEstadisticasPase;
    defensivas?: IEstadisticasDefensivas;
    golero?: IEstadisticasGolero;
    defensor?: IEstadisticasDefensor;
    mediocampista?: IEstadisticasMediocampista;
    delantero?: IEstadisticasDelantero;
}

export interface IJugadorCompleto {
    _id: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    nacionalidad: string;
    posiciones: string[];
    posicionPrincipal: string;
    altura: number;
    pieHabil: string;
    clubActualId: string | IClub; 
    historial_Clubes: IHistorialClubDetalle[];
    estadisticas_Temporadas: IEstadisticaTemporada[];
    historial_Lesiones: IHistorialLesion[];
}


export interface ITrayectoriaJugador {
    _id: string;
    nombre: string;
    apellido: string;
    posicionPrincipal: string;
    clubActual?: {
        _id: string;
        nombre: string;
        ciudad: string;
        pais?: string;
        estadio?: string;
    } | null;
    historial_Clubes: {
        _id: string;
        clubId: string;
        nombreClub: string;
        paisClub?: string;
        ciudadClub?: string;
        fechaInicio: string;
        fechaFin?: string | null;
        partidos: number;
    }[];
}