import express from 'express';
import { mostrarTrabajos} from '../controllers/homeController.js';
import { 
    formularioNuevaVacante, 
    agregarVacante, 
    mostrarVacante, 
    formEditarVacante, 
    editarVacante,
    validarVacante,
    eliminarVacante,
    contactar,
    subirCV,
    mostrarCandidatos,

    } from '../controllers/vacantesController.js';
import { 
    formCrearCuenta, 
    crearUsuario, 
    validarRegistro,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    validarPerfil,
    subirImagen
    } from '../controllers/usuariosController.js';
import { 
    autenticarUsuario, 
    mostrarPanel, 
    verificarUsuario, 
    cerrarSesion,
    formReestablecerPassword,
    enviarToken
 } from '../controllers/authController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);
router.get('/vacantes/nueva', verificarUsuario, formularioNuevaVacante);
router.post('/vacantes/nueva', verificarUsuario, validarVacante, agregarVacante);

// mostrar una vacante
router.get('/vacantes/:url', mostrarVacante);

// editar vacante
router.get('/vacantes/editar/:url', verificarUsuario, formEditarVacante);
router.post('/vacantes/editar/:url', verificarUsuario, validarVacante, editarVacante);

// eliminar vacante
router.delete('/vacantes/eliminar/:id', verificarUsuario, eliminarVacante);

// crear cuentas
router.get('/crear-cuenta', formCrearCuenta);
router.post('/crear-cuenta', validarRegistro, crearUsuario);

// Autenticar usuarios
router.get('/iniciar-sesion', formIniciarSesion);
router.post('/iniciar-sesion', autenticarUsuario);

// cerrar sesion
router.get('/cerrar-sesion',verificarUsuario, cerrarSesion );

// Resetear password
router.get('/reestablecer-password', formReestablecerPassword);
router.post('/reestablecer-password', enviarToken);

// Administracion 
router.get('/administracion', verificarUsuario ,mostrarPanel);

// editar perfil 
router.get('/editar-perfil', verificarUsuario, formEditarPerfil);
router.post('/editar-perfil', verificarUsuario, subirImagen, editarPerfil);

// Recibir mensajes de candidatos
router.post('/vacantes/:url', subirCV, contactar);

// Muestra los candidatos por vacante
router.get('/candidatos/:id', verificarUsuario, mostrarCandidatos);

export default router;