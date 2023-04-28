import Vacante from '../models/Vacantes.js'

const mostrarTrabajos = async (req, res, next) => {
    const vacantes = await Vacante.find();
    if(!vacantes) return next();
    res.render('home', {
        nombrePagina: 'SlizerJobs',
        tagline: 'Encuentra y publica trabajos para Desarrolladores Web',
        barra: true,
        boton: true,
        cerrarSesion: true,
        vacantes
    })
}

export {
    mostrarTrabajos
}