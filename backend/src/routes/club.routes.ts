import { Router } from 'express';
import { crearClub, obtenerClubes, obtenerClubPorId,obtenerPlantillaClub } from '../controllers/club.controller';

const router = Router();

router.post('/', crearClub);
router.get('/', obtenerClubes);
router.get('/:id', obtenerClubPorId);
router.get('/:id/plantilla', obtenerPlantillaClub);

export default router;