
const mostrarTrabajos = async (req, res) => {
    res.render('home', {
        nombrePagina: 'SlizerJobs',
        tagline: 'Encuentra y publica trabajos para Desarrolladores Web',
        barra: true,
        boton: true,
    })
}

export {
    mostrarTrabajos
}