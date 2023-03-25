import express from 'express';
import { mostrarTrabajos} from '../controllers/homeController.js';
import { formularioNuevaVacante, agregarVacante } from '../controllers/vacantesController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);
router.get('/vacantes/nueva', formularioNuevaVacante);
router.post('/vacantes/nueva', agregarVacante);
export default router;