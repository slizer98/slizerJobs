import Vacante from '../models/Vacantes.js';

const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
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
        barra: true
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

export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
}