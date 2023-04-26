import passport from "passport";
import Vacante from "../models/Vacantes.js";

const autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/administracion",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios",

});

// Revisar si el usuario esta autenticado o no
const verificarUsuario = (req, res, next) => {
    // Revisar el usuario
    if (req.isAuthenticated()) {
        return next(); // El usuario esta autenticado, adelante
    }

    // Redireccionar al formulario
    res.redirect("/iniciar-sesion");
}

const mostrarPanel = async(req, res) => {
    const vacantes = await Vacante.find({ autor: req.user._id });

    res.render("administracion", {
        nombrePagina: "Panel de Administración",
        tagline: "Crea y administra tus vacantes desde aquí",
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes,
    });
}

const cerrarSesion = (req, res) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('correcto', 'Cerraste sesión correctamente');
        return res.redirect('/iniciar-sesion')
    });
}

export { autenticarUsuario, mostrarPanel, verificarUsuario, cerrarSesion };