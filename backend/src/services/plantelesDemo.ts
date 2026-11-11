import { ClubModel } from '../models/Club';
import { JugadorModel } from '../models/Jugador';

interface Planteles {
    planteles: { clubIdTransfermarkt: string; jugadores: { id: string; nombreCompleto: string; posicion: string }[] }[];
}
const datos: Planteles = require('../data/planteles-transfermarkt.json');

const clubes: Record<string, string> = {
    '861': 'Club Atlético Peñarol', '866': 'Club Nacional de Football',
    '37535': 'Montevideo City Torque', '2619': 'Defensor Sporting Club',
    '17428': 'Club Atlético Juventud de Las Piedras', '18074': 'Club Atlético Boston River',
    '10663': 'Liverpool Fútbol Club', '42149': 'Albion Football Club',
    '14758': 'Racing Club de Montevideo', '10960': 'Central Español Fútbol Club',
    '18075': 'Club Deportivo Maldonado', '17595': 'Club Atlético Progreso',
    '2403': 'Montevideo Wanderers Fútbol Club', '20189': 'Cerro Largo Fútbol Club',
    '1306': 'Danubio Fútbol Club', '14806': 'Club Atlético Cerro',
};

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export function posicionPrincipal(posicion: string) {
    if (posicion === 'Portero') return 'GOLERO';
    if (posicion.startsWith('Defensa') || posicion.startsWith('Lateral')) return 'DEFENSOR';
    if (posicion.startsWith('Delantero') || posicion.startsWith('Extremo')) return 'DELANTERO';
    if (['Interior derecho', 'Interior izquierdo', 'Mediapunta', 'Mediocentro', 'Mediocentro ofensivo', 'Pivote'].includes(posicion)) return 'MEDIOCAMPISTA';
    throw new Error(`Posición sin correspondencia: ${posicion}`);
}

// Solo nombre, club y posición proceden de Transfermarkt. El resto es sintético.
export function generarDatosDemo(id: string, posicion: string) {
    let estado = Number(id) || 1;
    const numero = (min: number, max: number) => {
        estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
        return min + estado % (max - min + 1);
    };
    const estadisticas_Temporadas = [2024, 2025, 2026].map(temporada => {
        const partidos = numero(8, 30);
        const titularidades = numero(0, partidos);
        const goles = numero(0, posicion === 'DELANTERO' ? 18 : 6);
        const asistencias = numero(0, 12);
        const pasesProgresivos = numero(20, 180);
        const ocasionesCreadas = numero(5, 65);
        return {
            temporada, competicion: 'Primera División',
            generales: { partidos, titularidades, minutos: titularidades * 75 + (partidos - titularidades) * 15, tarjetasAmarillas: numero(0, 10), tarjetasRojas: numero(0, 2) },
            ...(posicion === 'GOLERO' ? {
                golero: { atajadas: numero(20, 130), golesRecibidos: numero(5, 45), vallasInvictas: numero(0, partidos), penalesAtajados: numero(0, 3), erroresQueTerminanEnGol: numero(0, 4), salidasExitosas: numero(5, 40) },
            } : {
                ofensivas: { goles, asistencias, xG: numero(0, 180) / 10, xA: numero(0, 100) / 10, tiros: goles + numero(15, 80), tirosAlArco: goles + numero(0, 15), regates: numero(10, 100) },
                pase: { pasesCompletados: numero(150, 1800), pasesClave: numero(5, 80), pasesProgresivos, ocasionesCreadas },
                defensivas: { duelosGanados: numero(20, 220), intercepciones: numero(10, 90), recuperaciones: numero(20, 180), despejes: numero(5, 100), entradas: numero(10, 100) },
                ...(posicion === 'DEFENSOR' ? { defensor: { bloqueos: numero(5, 50), duelosAereosGanados: numero(15, 130) } } : {}),
                ...(posicion === 'MEDIOCAMPISTA' ? { mediocampista: { regatesCompletados: numero(5, 80), duelosOfensivosGanados: numero(10, 150), pasesProgresivos, ocasionesCreadas } } : {}),
                ...(posicion === 'DELANTERO' ? { delantero: { duelosOfensivosGanados: numero(15, 150), regatesCompletados: numero(10, 90) } } : {}),
            }),
        };
    });
    return {
        fechaNacimiento: new Date(Date.UTC(numero(1990, 2006), numero(0, 11), numero(1, 28))),
        nacionalidad: 'Uruguaya', altura: numero(165, 198), pieHabil: numero(0, 2) === 0 ? 'Izquierdo' : 'Derecho',
        estadisticas_Temporadas, historial_Lesiones: [],
    };
}

export async function cargarPlanteles() {
    const catalogo = await ClubModel.find().lean();
    const existentes = await JugadorModel.find().select('nombre apellido').lean();
    const nombres = new Set(existentes.map(j => normalizar(`${j.nombre} ${j.apellido}`)));
    const pendientes = [];
    // Validamos todos los clubes antes de insertar el primer jugador.
    for (const plantel of datos.planteles) {
        const club = catalogo.find(c => c.nombre === clubes[plantel.clubIdTransfermarkt]);
        if (!club) throw new Error(`Falta el club ${clubes[plantel.clubIdTransfermarkt]}.`);
        for (const jugador of plantel.jugadores) {
            const clave = normalizar(jugador.nombreCompleto);
            if (nombres.has(clave)) continue;
            const partes = jugador.nombreCompleto.trim().split(/\s+/);
            if (partes.length < 2) throw new Error(`Revisar nombre: ${jugador.nombreCompleto}`);
            const nombre = partes.shift()!;
            const apellido = partes.join(' ');
            const posicion = posicionPrincipal(jugador.posicion);
            const demo = generarDatosDemo(jugador.id, posicion);
            pendientes.push({
                nombre, apellido, posiciones: [posicion], posicionPrincipal: posicion, clubActualId: club._id,
                ...demo,
                historial_Clubes: [{ clubId: club._id, fechaInicio: new Date('2024-01-01T00:00:00Z'), fechaFin: null, partidos: demo.estadisticas_Temporadas.reduce((suma, t) => suma + t.generales.partidos, 0) }],
            });
            nombres.add(clave);
        }
    }
    // La validación se realiza antes de escribir; los jugadores ya existentes se conservan.
    for (const jugador of pendientes) await new JugadorModel(jugador).validate();
    if (pendientes.length) await JugadorModel.insertMany(pendientes);
    return pendientes.length;
}
