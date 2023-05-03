import passport from "passport";
import Vacante from "../models/Vacantes.js";
import Usuarios from "../models/Usuarios.js";
import crypto from "crypto";
import { enviarEmail } from "../handlers/email.js";

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

// formulario para reiniciar el password

const formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password coloca tu email'
    })
}

// genera el token en la tabla del usuario
const enviarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({email: req.body.email});
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/crear-cuenta');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;
    console.log(resetUrl);

    await enviarEmail({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}


// valida si el token es valido y el usuario existe, muestra la vista
const reestablecerPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if (!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // todo bien, mostrar el formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nuevo Password'
    })
}

// almacena el nuevo password en la BD
const guardarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if (!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // guardar en la BD
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;
    await usuario.save();

    req.flash('correcto', 'Password modificado correctamente');
    res.redirect('/iniciar-sesion');

}

export { 
    autenticarUsuario, 
    mostrarPanel, 
    verificarUsuario, 
    cerrarSesion ,
    formReestablecerPassword,
    enviarToken,
    reestablecerPassword,
    guardarPassword
};