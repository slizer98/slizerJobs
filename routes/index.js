import express from 'express';
import { mostrarTrabajos} from '../controllers/homeController.js';
import { formularioNuevaVacante, agregarVacante, mostrarVacante, editarVacante } from '../controllers/vacantesController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);
router.get('/vacantes/nueva', formularioNuevaVacante);
router.post('/vacantes/nueva', agregarVacante);

// mostrar una vacante
router.get('/vacantes/:url', mostrarVacante);

// editar vacante
router.get('/vacantes/editar/:url', editarVacante);
export default router;