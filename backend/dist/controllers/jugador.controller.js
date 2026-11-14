"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarJugador = exports.crearJugador = exports.obtenerLesionesJugador = exports.agregarLesion = exports.obtenerRanking = exports.buscarScouting = exports.obtenerEvolucionJugador = exports.obtenerTrayectoriaJugadorPorId = exports.obtenerTrayectoriaClubes = exports.obtenerJugadorPorId = exports.obtenerJugadores = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jugador_service_1 = require("../services/jugador.service");
// 1. LISTADO GENERAL
const obtenerJugadores = async (req, res) => {
    try {
        const jugadores = await jugador_service_1.JugadorService.obtenerTodos();
        res.json(jugadores);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores', detalle: error.message });
    }
};
exports.obtenerJugadores = obtenerJugadores;
// 2. DETALLE DE JUGADOR POR ID
const obtenerJugadorPorId = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const jugador = await jugador_service_1.JugadorService.obtenerPorId(id);
        if (!jugador) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json(jugador);
    }
    catch (error) {
        res.status(400).json({ error: 'Error al obtener el jugador', detalle: error.message });
    }
};
exports.obtenerJugadorPorId = obtenerJugadorPorId;
// 3. CONSULTA 4.1: TRAYECTORIA GLOBAL ($lookup)
const obtenerTrayectoriaClubes = async (req, res) => {
    try {
        const resultado = await jugador_service_1.JugadorService.obtenerTrayectoriaClubesGlobal();
        res.json(resultado);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la trayectoria global', detalle: error.message });
    }
};
exports.obtenerTrayectoriaClubes = obtenerTrayectoriaClubes;
// 4. CONSULTA 4.1: TRAYECTORIA DE JUGADOR POR ID ($lookup)
const obtenerTrayectoriaJugadorPorId = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID de jugador no válido' });
        }
        const resultado = await jugador_service_1.JugadorService.obtenerTrayectoriaJugadorPorId(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json(resultado);
    }
    catch (error) {
        console.error('Error al consultar trayectoria por ID:', error);
        res.status(500).json({ error: 'Error interno al consultar la trayectoria del jugador', detalle: error.message });
    }
};
exports.obtenerTrayectoriaJugadorPorId = obtenerTrayectoriaJugadorPorId;
// 5. CONSULTA 4.2: EVOLUCIÓN MULTITEMPORADA ($unwind + $group)
const obtenerEvolucionJugador = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'El ID provisto no es un ObjectId válido' });
        }
        const resultado = await jugador_service_1.JugadorService.obtenerEvolucionJugador(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json(resultado);
    }
    catch (error) {
        res.status(400).json({ error: 'Error en la agregación de evolución', detalle: error.message });
    }
};
exports.obtenerEvolucionJugador = obtenerEvolucionJugador;
// 6. CONSULTA SCOUTING SIMPLE ($match + $sort)
const buscarScouting = async (req, res) => {
    try {
        const { posicion, minGoles } = req.query;
        const resultado = await jugador_service_1.JugadorService.buscarScouting(posicion ? String(posicion) : undefined, minGoles ? Number(minGoles) : undefined);
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ error: 'Error en la consulta de scouting', detalle: error.message });
    }
};
exports.buscarScouting = buscarScouting;
// 7. CONSULTA 4.3: RANKING AUTOMÁTICO DE SCOUTING ($match, $switch, $sort, $limit)
const obtenerRanking = async (req, res) => {
    try {
        const { posicion, minGoles, cantidad } = req.query;
        const pos = posicion ? String(posicion) : 'DELANTERO';
        const limitNum = cantidad ? Number(cantidad) : 10;
        const minGolesNum = minGoles ? Number(minGoles) : undefined;
        const ranking = await jugador_service_1.JugadorService.obtenerRankingPorPosicion(pos, limitNum, minGolesNum);
        res.json(ranking);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al generar el ranking por posición', detalle: error.message });
    }
};
exports.obtenerRanking = obtenerRanking;
// 8. AGREGAR LESIÓN ($push)
const agregarLesion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const jugadorActualizado = await jugador_service_1.JugadorService.agregarLesion(id, req.body);
        if (!jugadorActualizado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json(jugadorActualizado);
    }
    catch (error) {
        res.status(400).json({ error: 'Error al registrar lesión', detalle: error.message });
    }
};
exports.agregarLesion = agregarLesion;
// 9. OBTENER LESIONES DE JUGADOR
const obtenerLesionesJugador = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const resultado = await jugador_service_1.JugadorService.obtenerLesionesJugador(id);
        if (!resultado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener lesiones', detalle: error.message });
    }
};
exports.obtenerLesionesJugador = obtenerLesionesJugador;
// 10. CREAR JUGADOR (CRUD)
const crearJugador = async (req, res) => {
    try {
        const nuevoJugador = await jugador_service_1.JugadorService.crearJugador(req.body);
        res.status(201).json(nuevoJugador);
    }
    catch (error) {
        res.status(400).json({ error: 'Error al crear jugador', detalle: error.message });
    }
};
exports.crearJugador = crearJugador;
// 11. ELIMINAR JUGADOR (CRUD)
const eliminarJugador = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const eliminado = await jugador_service_1.JugadorService.eliminarJugador(id);
        if (!eliminado) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }
        res.json({ mensaje: 'Jugador eliminado', jugador: eliminado });
    }
    catch (error) {
        res.status(400).json({ error: 'Error al eliminar', detalle: error.message });
    }
};
exports.eliminarJugador = eliminarJugador;
