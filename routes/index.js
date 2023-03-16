import express from 'express';
import { mostrarTrabajos} from '../controllers/homeController.js';
import { formularioNuevaVacante } from '../controllers/vacantesController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);
router.get('/vacantes/nueva', formularioNuevaVacante);
export default router;