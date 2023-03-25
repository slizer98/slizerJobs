import Vacante from '../models/Vacantes.js';

const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    });
}

const agregarVacante = async(req, res) => {
    const vacante = new Vacante(req.body);

    // Crear arreglo de habilidades
    vacante.skills = req.body.skills.split(',');
    // Almacenar en la BD
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}}`);
}

export {
    formularioNuevaVacante,
    agregarVacante
}