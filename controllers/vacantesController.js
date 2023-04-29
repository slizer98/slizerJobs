import {check, validationResult}  from 'express-validator'
import Vacante from '../models/Vacantes.js';
import multer from 'multer';
import shortid from 'shortid';
import path from 'path';

const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    });
}

const agregarVacante = async(req, res) => {
    const vacante = new Vacante(req.body);

    vacante.autor = req.user._id;

    // Crear arreglo de habilidades
    vacante.skills = req.body.skills.split(',');
    // Almacenar en la BD
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

const mostrarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');

    if (!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}

const formEditarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen

    });
}

const editarVacante = async(req, res) => {
    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');
    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url }, 
        vacanteActualizada,
        {
            new: true,
            runValidators: true
    })
    
    res.redirect(`/vacantes/${vacante.url}`);
}

// validar campos de nuevas vacantes
const validarVacante = async(req, res, next) => {
    await check('titulo', 'Agrega un titulo a la vacante').notEmpty().run(req);
    await check('empresa', 'Agrega una empresa').notEmpty().run(req);
    await check('ubicacion', 'Agrega una ubicacion').notEmpty().run(req);
    await check('contrato', 'Selecciona el tipo de contrato').notEmpty().run(req);
    await check('skills', 'Agrega al menos una habilidad').notEmpty().run(req);

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        req.flash('error', errores.array().map(error => error.msg));
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            mensajes: req.flash()
        });
        return;
    }
    next();
}   

const eliminarVacante = async(req, res, next) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);
    if(!verificarAutor(vacante, req.user)){
        res.status(403).send('Error');
        return next();
    }
    vacante.deleteOne();
    res.status(200).send('Vacante eliminada correctamente');
}

const verificarAutor = async(vacante = {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)) return false;
    return true;
}   

// Subir archivos en PDF

const subirCV = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if( error.code == 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 500kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            return res.redirect('back');
        }
        next();
    }) 
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/cv');
    },
    filename: (req, file, cb) => {
        cb(null, shortid.generate() + path.extname(file.originalname));
    },
});

const configuracionMulter = {
    limits: {fileSize: 500000},
    storage: fileStorage,
    fileFilter(req, file, cb){
        if(file.mimetype === 'application/pdf'){
           return cb(null, true);
        }
        cb(new Error('Formato No Valido'), false);
    },
}

const upload = multer(configuracionMulter).single('cv');

// alamacena los candidatos en la BD
const contactar = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url});

    if(!vacante) return next();

    // todo bien, construir el nuevo objeto
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    };

    // almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    // mensaje flash y redireccion
    req.flash('correcto', 'Se envió tu Curriculum Correctamente');
    res.redirect('/');
}

const mostrarCandidatos = async(req, res, next) => {
    const vacante = await Vacante.findById(req.params.id);
    if(vacante.autor != req.user._id.toString()){
        return next();
    }
    if(!vacante) return next();
    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    });
}

export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    validarVacante,
    eliminarVacante,
    subirCV,
    contactar,
    mostrarCandidatos
}