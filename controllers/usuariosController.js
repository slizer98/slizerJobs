import multer from 'multer';
import Usuarios from '../models/Usuarios.js';
import {check, validationResult}  from 'express-validator'
import { fileURLToPath } from 'url';
import shortid from 'shortid';
import path from 'path';


const subirImagen = (req, res, next) => {
    upload(req, res, function(error){
        if(error instanceof multer.MulterError){
            return next();
        }
        next();
    }) 
}

const filePath = fileURLToPath(new URL('../../public/uploads/perfiles', import.meta.url));


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/perfiles');
    },
    filename: (req, file, cb) => {
        cb(null, shortid.generate() + path.extname(file.originalname));
    },
});

const configuracionMulter = {
    storage: fileStorage,
    fileFilter(req, file, cb){
        if(!file.mimetype === 'image/jpeg' || !file.mimetype === 'image/png'){
            cb(null, false);
        }
        cb(null, true);
    },
    limits: {fileSize: 100000}
}

const upload = multer(configuracionMulter).single('imagen');


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
   
    if(req.file) {
        usuario.imagen = req.file.filename;
    }
    
    await usuario.save();

    req.flash('correcto', 'Cambios guardados correctamente');
    setTimeout(() => {
        res.redirect('/administracion');
    }, 1000);
}

const validarPerfil = async(req, res, next) => {
    await check('nombre', 'El nombre es obligatorio').notEmpty().run(req);
    await check('email', 'El email es obligatorio').notEmpty().run(req);
    if(req.body.password){
        await check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}).run(req);
    }
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        req.flash('error', errores.array().map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en SlizerJobs',
            usuario: req.user,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        });
        return;
    }
    next();
}

export {
    formCrearCuenta,
    validarRegistro,
    crearUsuario,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    validarPerfil,
    subirImagen
}