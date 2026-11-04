"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubesPrimera = void 0;
exports.completarClubesPrimera = completarClubesPrimera;
const Club_1 = require("../models/Club");
// Los 16 clubes de la Primera División 2026 indicados en la referencia.
exports.clubesPrimera = [
    { nombre: 'Club Nacional de Football', ciudad: 'Montevideo', estadio: 'Gran Parque Central' },
    { nombre: 'Defensor Sporting Club', ciudad: 'Montevideo', estadio: 'Luis Franzini' },
    { nombre: 'Danubio Fútbol Club', ciudad: 'Montevideo', estadio: 'Jardines del Hipódromo' },
    { nombre: 'Liverpool Fútbol Club', ciudad: 'Montevideo', estadio: 'Belvedere' },
    { nombre: 'Montevideo Wanderers Fútbol Club', ciudad: 'Montevideo', estadio: 'Parque Alfredo Víctor Viera' },
    { nombre: 'Montevideo City Torque', ciudad: 'Montevideo' },
    { nombre: 'Club Deportivo Maldonado', ciudad: 'Maldonado' },
    { nombre: 'Club Atlético Peñarol', ciudad: 'Montevideo' },
    { nombre: 'Racing Club de Montevideo', ciudad: 'Montevideo' },
    { nombre: 'Club Atlético Progreso', ciudad: 'Montevideo' },
    { nombre: 'Club Atlético Juventud de Las Piedras', ciudad: 'Las Piedras' },
    { nombre: 'Club Atlético Cerro', ciudad: 'Montevideo' },
    { nombre: 'Club Atlético Boston River', ciudad: 'Montevideo' },
    { nombre: 'Albion Football Club', ciudad: 'Montevideo' },
    { nombre: 'Cerro Largo Fútbol Club', ciudad: 'Melo' },
    { nombre: 'Central Español Fútbol Club', ciudad: 'Montevideo' },
];
async function completarClubesPrimera() {
    let agregados = 0;
    for (const club of exports.clubesPrimera) {
        const resultado = await Club_1.ClubModel.updateOne({ nombre: club.nombre }, { $setOnInsert: { ...club, pais: 'Uruguay', division: 'Primera División' } }, { upsert: true, runValidators: true });
        agregados += resultado.upsertedCount;
    }
    return agregados;
}
