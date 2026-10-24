import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ClubModel } from './models/Club';
import { JugadorModel } from './models/Jugador';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scouting_db';
    await mongoose.connect(mongoURI);
    console.log('🌱 Limpiando base de datos en MongoDB...');

    await ClubModel.deleteMany({});
    await JugadorModel.deleteMany({});

    // =============================================================
    // 1. CREACIÓN DE CLUBES (Primera División Uruguay)
    // =============================================================
    const nacional = await ClubModel.create({
      nombre: 'Club Nacional de Football',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      estadio: 'Gran Parque Central',
      division: 'Primera División'
    });

    const defensor = await ClubModel.create({
      nombre: 'Defensor Sporting Club',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      estadio: 'Luis Franzini',
      division: 'Primera División'
    });

    const danubio = await ClubModel.create({
      nombre: 'Danubio Fútbol Club',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      estadio: 'Jardines del Hipódromo',
      division: 'Primera División'
    });

    const liverpool = await ClubModel.create({
      nombre: 'Liverpool Fútbol Club',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      estadio: 'Belvedere',
      division: 'Primera División'
    });

    const wanderers = await ClubModel.create({
      nombre: 'Montevideo Wanderers Fútbol Club',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      estadio: 'Parque Alfredo Víctor Viera',
      division: 'Primera División'
    });

    console.log('✅ 5 Clubes creados exitosamente.');

    // =============================================================
    // 2. JUGADORES CON ESQUEMA FLEXIBLE SEGÚN SU POSICIÓN
    // =============================================================

    await JugadorModel.create([
      // -----------------------------------------------------------
      // 1. CLUB NACIONAL DE FOOTBALL
      // -----------------------------------------------------------
      // --- Golero Titular ---
      {
        nombre: 'Luis',
        apellido: 'Mejía',
        fechaNacimiento: new Date('1991-03-16'),
        nacionalidad: 'Panameña',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 191,
        pieHabil: 'Derecho',
        clubActualId: nacional._id,
        historial_Clubes: [
          { clubId: danubio._id, fechaInicio: new Date('2021-01-01'), fechaFin: new Date('2023-12-31'), partidos: 65 },
          { clubId: nacional._id, fechaInicio: new Date('2024-01-01'), fechaFin: null, partidos: 52 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 28, titularidades: 28, minutos: 2520, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            golero: { atajadas: 90, golesRecibidos: 24, vallasInvictas: 12, penalesAtajados: 1, erroresQueTerminanEnGol: 1, salidasExitosas: 18 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 30, titularidades: 30, minutos: 2700, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            golero: { atajadas: 104, golesRecibidos: 19, vallasInvictas: 15, penalesAtajados: 3, erroresQueTerminanEnGol: 0, salidasExitosas: 25 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 22, titularidades: 22, minutos: 1980, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 75, golesRecibidos: 15, vallasInvictas: 11, penalesAtajados: 1, erroresQueTerminanEnGol: 0, salidasExitosas: 19 }
          }
        ],
        historial_Lesiones: [
          { tipo: 'Muscular', fechaInicio: new Date('2024-05-10'), fechaFin: new Date('2024-05-28'), diasInactividad: 18, descripcion: 'Microdesgarro en gemelo izquierdo' }
        ]
      },
      // --- Golero Suplente ---
      {
        nombre: 'Ignacio',
        apellido: 'Suárez',
        fechaNacimiento: new Date('2002-02-05'),
        nacionalidad: 'Uruguaya',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 187,
        pieHabil: 'Derecho',
        clubActualId: nacional._id,
        historial_Clubes: [
          { clubId: nacional._id, fechaInicio: new Date('2022-01-01'), fechaFin: null, partidos: 15 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 6, titularidades: 6, minutos: 540, tarjetasAmarillas: 0, tarjetasRojas: 0 },
            golero: { atajadas: 20, golesRecibidos: 5, vallasInvictas: 2, penalesAtajados: 0, erroresQueTerminanEnGol: 0, salidasExitosas: 6 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 8, titularidades: 8, minutos: 720, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 28, golesRecibidos: 7, vallasInvictas: 3, penalesAtajados: 1, erroresQueTerminanEnGol: 0, salidasExitosas: 8 }
          }
        ],
        historial_Lesiones: []
      },
      // --- Defensor Titular ---
      {
        nombre: 'Sebastian',
        apellido: 'Coates',
        fechaNacimiento: new Date('1990-10-07'),
        nacionalidad: 'Uruguaya',
        posiciones: ['DEFENSOR'],
        posicionPrincipal: 'DEFENSOR',
        altura: 196,
        pieHabil: 'Derecho',
        clubActualId: nacional._id,
        historial_Clubes: [
          { clubId: nacional._id, fechaInicio: new Date('2009-01-01'), fechaFin: new Date('2011-08-31'), partidos: 55 },
          { clubId: nacional._id, fechaInicio: new Date('2024-07-01'), fechaFin: null, partidos: 45 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 26, titularidades: 26, minutos: 2340, tarjetasAmarillas: 5, tarjetasRojas: 0 },
            ofensivas: { goles: 4, asistencias: 1, xG: 3.2, xA: 0.8, tiros: 22, tirosAlArco: 11, regates: 3 },
            defensivas: { duelosGanados: 125, intercepciones: 52, recuperaciones: 118, despejes: 98, entradas: 25 },
            defensor: { bloqueos: 28, duelosAereosGanados: 84 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 21, titularidades: 21, minutos: 1890, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            ofensivas: { goles: 2, asistencias: 1, xG: 1.8, xA: 0.5, tiros: 15, tirosAlArco: 7, regates: 2 },
            defensivas: { duelosGanados: 102, intercepciones: 41, recuperaciones: 95, despejes: 78, entradas: 19 },
            defensor: { bloqueos: 21, duelosAereosGanados: 68 }
          }
        ],
        historial_Lesiones: [
          { tipo: 'Ósea', fechaInicio: new Date('2025-09-01'), fechaFin: new Date('2025-10-15'), diasInactividad: 44, descripcion: 'Fisura en costilla' }
        ]
      },
      // --- Mediocampista Titular ---
      {
        nombre: 'Mauricio',
        apellido: 'Pereyra',
        fechaNacimiento: new Date('1990-03-15'),
        nacionalidad: 'Uruguaya',
        posiciones: ['MEDIOCAMPISTA', 'ENGANCHE'],
        posicionPrincipal: 'MEDIOCAMPISTA',
        altura: 172,
        pieHabil: 'Derecho',
        clubActualId: nacional._id,
        historial_Clubes: [
          { clubId: nacional._id, fechaInicio: new Date('2009-01-01'), fechaFin: new Date('2011-06-30'), partidos: 52 },
          { clubId: nacional._id, fechaInicio: new Date('2024-01-01'), fechaFin: null, partidos: 65 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 26, titularidades: 24, minutos: 2080, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            ofensivas: { goles: 6, asistencias: 10, xG: 5.2, xA: 8.9, tiros: 36, tirosAlArco: 16, regates: 28 },
            pase: { pasesCompletados: 1120, pasesClave: 55, pasesProgresivos: 165, ocasionesCreadas: 60 },
            defensivas: { duelosGanados: 62, intercepciones: 15, recuperaciones: 58, despejes: 5, entradas: 11 },
            mediocampista: { regatesCompletados: 22, duelosOfensivosGanados: 28, pasesProgresivos: 165, ocasionesCreadas: 60 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 28, titularidades: 26, minutos: 2240, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            ofensivas: { goles: 5, asistencias: 12, xG: 4.5, xA: 10.2, tiros: 32, tirosAlArco: 14, regates: 30 },
            pase: { pasesCompletados: 1250, pasesClave: 62, pasesProgresivos: 180, ocasionesCreadas: 68 },
            defensivas: { duelosGanados: 68, intercepciones: 18, recuperaciones: 64, despejes: 6, entradas: 12 },
            mediocampista: { regatesCompletados: 24, duelosOfensivosGanados: 30, pasesProgresivos: 180, ocasionesCreadas: 68 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 20, titularidades: 18, minutos: 1520, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            ofensivas: { goles: 3, asistencias: 8, xG: 2.9, xA: 6.8, tiros: 22, tirosAlArco: 9, regates: 18 },
            pase: { pasesCompletados: 880, pasesClave: 40, pasesProgresivos: 128, ocasionesCreadas: 45 },
            defensivas: { duelosGanados: 48, intercepciones: 10, recuperaciones: 42, despejes: 3, entradas: 8 },
            mediocampista: { regatesCompletados: 15, duelosOfensivosGanados: 20, pasesProgresivos: 128, ocasionesCreadas: 45 }
          }
        ],
        historial_Lesiones: []
      },
      // --- Delantero Titular ---
      {
        nombre: 'Gonzalo',
        apellido: 'Carneiro',
        fechaNacimiento: new Date('1995-09-12'),
        nacionalidad: 'Uruguaya',
        posiciones: ['DELANTERO'],
        posicionPrincipal: 'DELANTERO',
        altura: 194,
        pieHabil: 'Zurdo',
        clubActualId: nacional._id,
        historial_Clubes: [
          { clubId: defensor._id, fechaInicio: new Date('2015-01-01'), fechaFin: new Date('2018-04-30'), partidos: 41 },
          { clubId: nacional._id, fechaInicio: new Date('2023-07-15'), fechaFin: null, partidos: 58 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 20, titularidades: 18, minutos: 1540, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            ofensivas: { goles: 10, asistencias: 3, xG: 9.1, xA: 2.5, tiros: 48, tirosAlArco: 24, regates: 30 },
            delantero: { duelosOfensivosGanados: 50, regatesCompletados: 22 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 24, titularidades: 22, minutos: 1920, tarjetasAmarillas: 4, tarjetasRojas: 0 },
            ofensivas: { goles: 14, asistencias: 5, xG: 13.2, xA: 4.1, tiros: 68, tirosAlArco: 35, regates: 42 },
            delantero: { duelosOfensivosGanados: 68, regatesCompletados: 31 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 18, titularidades: 16, minutos: 1380, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            ofensivas: { goles: 9, asistencias: 3, xG: 8.5, xA: 2.8, tiros: 42, tirosAlArco: 21, regates: 25 },
            delantero: { duelosOfensivosGanados: 45, regatesCompletados: 19 }
          }
        ],
        historial_Lesiones: [
          { tipo: 'Ligamentaria', fechaInicio: new Date('2024-07-15'), fechaFin: new Date('2025-01-10'), diasInactividad: 179, descripcion: 'Rotura de ligamentos cruzados' }
        ]
      },

      // -----------------------------------------------------------
      // 2. DEFENSOR SPORTING CLUB
      // -----------------------------------------------------------
      // --- Golero Titular ---
      {
        nombre: 'Kevin',
        apellido: 'Dawson',
        fechaNacimiento: new Date('1992-02-08'),
        nacionalidad: 'Uruguaya',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 181,
        pieHabil: 'Derecho',
        clubActualId: defensor._id,
        historial_Clubes: [
          { clubId: defensor._id, fechaInicio: new Date('2024-01-01'), fechaFin: null, partidos: 60 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 27, titularidades: 27, minutos: 2430, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            golero: { atajadas: 92, golesRecibidos: 28, vallasInvictas: 9, penalesAtajados: 1, erroresQueTerminanEnGol: 2, salidasExitosas: 15 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 29, titularidades: 29, minutos: 2610, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            golero: { atajadas: 108, golesRecibidos: 22, vallasInvictas: 13, penalesAtajados: 2, erroresQueTerminanEnGol: 0, salidasExitosas: 20 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 21, titularidades: 21, minutos: 1890, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 72, golesRecibidos: 18, vallasInvictas: 9, penalesAtajados: 1, erroresQueTerminanEnGol: 0, salidasExitosas: 14 }
          }
        ],
        historial_Lesiones: []
      },
      // --- Delantero Titular ---
      {
        nombre: 'Octavio',
        apellido: 'Rivero',
        fechaNacimiento: new Date('1992-01-24'),
        nacionalidad: 'Uruguaya',
        posiciones: ['DELANTERO'],
        posicionPrincipal: 'DELANTERO',
        altura: 187,
        pieHabil: 'Derecho',
        clubActualId: defensor._id,
        historial_Clubes: [
          { clubId: wanderers._id, fechaInicio: new Date('2014-01-01'), fechaFin: new Date('2014-12-31'), partidos: 17 },
          { clubId: defensor._id, fechaInicio: new Date('2024-01-01'), fechaFin: null, partidos: 52 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 22, titularidades: 22, minutos: 1890, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            ofensivas: { goles: 12, asistencias: 2, xG: 11.2, xA: 1.8, tiros: 58, tirosAlArco: 29, regates: 18 },
            delantero: { duelosOfensivosGanados: 48, regatesCompletados: 12 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 26, titularidades: 26, minutos: 2250, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            ofensivas: { goles: 16, asistencias: 4, xG: 14.8, xA: 3.2, tiros: 72, tirosAlArco: 38, regates: 24 },
            delantero: { duelosOfensivosGanados: 62, regatesCompletados: 18 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 19, titularidades: 19, minutos: 1620, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            ofensivas: { goles: 11, asistencias: 2, xG: 9.8, xA: 1.9, tiros: 50, tirosAlArco: 25, regates: 15 },
            delantero: { duelosOfensivosGanados: 42, regatesCompletados: 11 }
          }
        ],
        historial_Lesiones: []
      },

      // -----------------------------------------------------------
      // 3. DANUBIO FÚTBOL CLUB
      // -----------------------------------------------------------
      // --- Golero Titular ---
      {
        nombre: 'Mauro',
        apellido: 'Goicoechea',
        fechaNacimiento: new Date('1988-03-27'),
        nacionalidad: 'Uruguaya',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 186,
        pieHabil: 'Derecho',
        clubActualId: danubio._id,
        historial_Clubes: [
          { clubId: danubio._id, fechaInicio: new Date('2006-01-01'), fechaFin: new Date('2012-06-30'), partidos: 110 },
          { clubId: danubio._id, fechaInicio: new Date('2023-01-01'), fechaFin: null, partidos: 85 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 28, titularidades: 28, minutos: 2520, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            golero: { atajadas: 98, golesRecibidos: 27, vallasInvictas: 10, penalesAtajados: 1, erroresQueTerminanEnGol: 2, salidasExitosas: 19 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 28, titularidades: 28, minutos: 2520, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 102, golesRecibidos: 23, vallasInvictas: 12, penalesAtajados: 2, erroresQueTerminanEnGol: 1, salidasExitosas: 22 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 20, titularidades: 20, minutos: 1800, tarjetasAmarillas: 0, tarjetasRojas: 0 },
            golero: { atajadas: 70, golesRecibidos: 19, vallasInvictas: 8, penalesAtajados: 1, erroresQueTerminanEnGol: 0, salidasExitosas: 14 }
          }
        ],
        historial_Lesiones: []
      },

      // -----------------------------------------------------------
      // 4. LIVERPOOL FÚTBOL CLUB
      // -----------------------------------------------------------
      // --- Golero Titular ---
      {
        nombre: 'Sebastian',
        apellido: 'Lentinelly',
        fechaNacimiento: new Date('1997-08-26'),
        nacionalidad: 'Uruguaya',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 186,
        pieHabil: 'Derecho',
        clubActualId: liverpool._id,
        historial_Clubes: [
          { clubId: liverpool._id, fechaInicio: new Date('2017-01-01'), fechaFin: null, partidos: 150 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 30, titularidades: 30, minutos: 2700, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            golero: { atajadas: 105, golesRecibidos: 25, vallasInvictas: 13, penalesAtajados: 2, erroresQueTerminanEnGol: 1, salidasExitosas: 22 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 28, titularidades: 28, minutos: 2520, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 98, golesRecibidos: 21, vallasInvictas: 14, penalesAtajados: 3, erroresQueTerminanEnGol: 0, salidasExitosas: 20 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 21, titularidades: 21, minutos: 1890, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 74, golesRecibidos: 17, vallasInvictas: 9, penalesAtajados: 1, erroresQueTerminanEnGol: 0, salidasExitosas: 15 }
          }
        ],
        historial_Lesiones: [
          { tipo: 'Ósea', fechaInicio: new Date('2023-05-12'), fechaFin: new Date('2023-07-01'), diasInactividad: 50, descripcion: 'Fisura en metacarpiano de la mano' }
        ]
      },

      // -----------------------------------------------------------
      // 5. MONTEVIDEO WANDERERS FÚTBOL CLUB
      // -----------------------------------------------------------
      // --- Golero Titular ---
      {
        nombre: 'Jhony',
        apellido: 'Da Silva',
        fechaNacimiento: new Date('1988-08-21'),
        nacionalidad: 'Uruguaya',
        posiciones: ['GOLERO'],
        posicionPrincipal: 'GOLERO',
        altura: 185,
        pieHabil: 'Derecho',
        clubActualId: wanderers._id,
        historial_Clubes: [
          { clubId: danubio._id, fechaInicio: new Date('2019-01-01'), fechaFin: new Date('2021-12-31'), partidos: 50 },
          { clubId: wanderers._id, fechaInicio: new Date('2024-01-01'), fechaFin: null, partidos: 55 }
        ],
        estadisticas_Temporadas: [
          {
            temporada: 2024,
            competicion: 'Primera División',
            generales: { partidos: 26, titularidades: 26, minutos: 2340, tarjetasAmarillas: 3, tarjetasRojas: 0 },
            golero: { atajadas: 88, golesRecibidos: 30, vallasInvictas: 8, penalesAtajados: 1, erroresQueTerminanEnGol: 2, salidasExitosas: 16 }
          },
          {
            temporada: 2025,
            competicion: 'Primera División',
            generales: { partidos: 27, titularidades: 27, minutos: 2430, tarjetasAmarillas: 2, tarjetasRojas: 0 },
            golero: { atajadas: 95, golesRecibidos: 28, vallasInvictas: 10, penalesAtajados: 2, erroresQueTerminanEnGol: 1, salidasExitosas: 18 }
          },
          {
            temporada: 2026,
            competicion: 'Primera División',
            generales: { partidos: 18, titularidades: 18, minutos: 1620, tarjetasAmarillas: 1, tarjetasRojas: 0 },
            golero: { atajadas: 62, golesRecibidos: 20, vallasInvictas: 6, penalesAtajados: 0, erroresQueTerminanEnGol: 1, salidasExitosas: 12 }
          }
        ],
        historial_Lesiones: []
      }
    ]);

    console.log('✅ Base de datos rellenada exitosamente respetando el esquema flexible.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDB();