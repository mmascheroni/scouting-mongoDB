"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jugador_controller_1 = require("../controllers/jugador.controller");
const router = (0, express_1.Router)();
// 1. RUTAS ESPECÍFICAS Y AGREGACIONES
router.get('/trayectoria', jugador_controller_1.obtenerTrayectoriaClubes);
router.get('/scouting', jugador_controller_1.obtenerRanking);
// CRUD General
router.get('/', jugador_controller_1.obtenerJugadores);
router.post('/', jugador_controller_1.crearJugador);
// 2. RUTAS PARAMETRIZADAS CON CONTEXTO ESPECÍFICO
router.get('/:id/trayectoria', jugador_controller_1.obtenerTrayectoriaJugadorPorId); // <--- TRAYECTORIA ESPECÍFICA
router.get('/evolucion/:id', jugador_controller_1.obtenerEvolucionJugador);
// ENDPOINTS DE LESIONES
router.get('/:id/lesiones', jugador_controller_1.obtenerLesionesJugador); // <--- GET LESIONES
router.post('/:id/lesiones', jugador_controller_1.agregarLesion); // <--- POST LESIÓN
// 3. RUTAS CON PARAMETRO GENÉRICO :id
router.get('/:id', jugador_controller_1.obtenerJugadorPorId);
router.delete('/:id', jugador_controller_1.eliminarJugador);
exports.default = router;
