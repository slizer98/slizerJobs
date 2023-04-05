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
export {
    formCrearCuenta,
    validarRegistro,
    crearUsuario,
}