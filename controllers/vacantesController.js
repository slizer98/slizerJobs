import {check, validationResult}  from 'express-validator'
import Vacante from '../models/Vacantes.js';

const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
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
    const vacante = await Vacante.findOne({ url: req.params.url });

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
        nombre: req.user.nombre

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

export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    validarVacante,
    eliminarVacante
}