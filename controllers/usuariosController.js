import Usuarios from '../models/Usuarios.js';
import {check, validationResult}  from 'express-validator'

const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta en SlizerJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}

const validarRegistro = async(req, res, next) => {

    await check('nombre', 'El nombre es obligatorio').notEmpty().escape().run(req);
    await check('email', 'El email es obligatorio').notEmpty().run(req);
    await check('password', 'El password es obligatorio').notEmpty().run(req);
    await check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}).run(req);
    await check('confirmar', 'El password no coincide').equals(req.body.password).notEmpty().run(req);
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crear cuenta en SlizerJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        });
        return;
    }
    next();
}

const crearUsuario = async(req, res, next) => {

    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }

}


const formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesion en SlizerJobs'
    });
}

const formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en SlizerJobs',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

const editarPerfil = async(req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password;
    }
    await usuario.save();
    // esperar a que el mensaje se quite para redireccionar
    req.flash('correcto', 'Cambios guardados correctamente');
    setTimeout(() => {
        res.redirect('/administracion');
    }, 1000);
}

export {
    formCrearCuenta,
    validarRegistro,
    crearUsuario,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
}