import express from 'express';
import { mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante, 
    agregarVacante, 
    mostrarVacante, 
    formEditarVacante, 
    editarVacante,
    } from '../controllers/vacantesController.js';
import { formCrearCuenta, crearUsuario, validarRegistro } from '../controllers/usuariosController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);
router.get('/vacantes/nueva', formularioNuevaVacante);
router.post('/vacantes/nueva', agregarVacante);

// mostrar una vacante
router.get('/vacantes/:url', mostrarVacante);

// editar vacante
router.get('/vacantes/editar/:url', formEditarVacante);
router.post('/vacantes/editar/:url', editarVacante);

// crear cuentas
router.get('/crear-cuenta', formCrearCuenta);
router.post('/crear-cuenta', validarRegistro, crearUsuario);

export default router;