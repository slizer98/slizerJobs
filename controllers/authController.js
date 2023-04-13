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
    // consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id });

    res.render("administracion", {
        nombrePagina: "Panel de Administración",
        tagline: "Crea y administra tus vacantes desde aquí",
        vacantes,
    });
}

export { autenticarUsuario, mostrarPanel, verificarUsuario };