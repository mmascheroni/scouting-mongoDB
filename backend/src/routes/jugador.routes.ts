import { Router } from 'express';
import {
  obtenerJugadores,
  obtenerJugadorPorId,
  obtenerTrayectoriaClubes,
  obtenerTrayectoriaJugadorPorId,
  obtenerEvolucionJugador,
  buscarScouting,
  obtenerLesionesJugador,
  agregarLesion,
  crearJugador,
  eliminarJugador,
  obtenerRanking
} from '../controllers/jugador.controller';

const router = Router();

// 1. RUTAS ESPECÍFICAS Y AGREGACIONES
router.get('/trayectoria', obtenerTrayectoriaClubes);
router.get('/scouting', obtenerRanking);

// CRUD General
router.get('/', obtenerJugadores);
router.post('/', crearJugador);

// 2. RUTAS PARAMETRIZADAS CON CONTEXTO ESPECÍFICO
router.get('/:id/trayectoria', obtenerTrayectoriaJugadorPorId); // <--- TRAYECTORIA ESPECÍFICA
router.get('/evolucion/:id', obtenerEvolucionJugador);

// ENDPOINTS DE LESIONES
router.get('/:id/lesiones', obtenerLesionesJugador); // <--- GET LESIONES
router.post('/:id/lesiones', agregarLesion);         // <--- POST LESIÓN

// 3. RUTAS CON PARAMETRO GENÉRICO :id
router.get('/:id', obtenerJugadorPorId);
router.delete('/:id', eliminarJugador);

export default router;