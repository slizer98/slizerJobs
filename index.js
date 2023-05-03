
import './config/db.js';
import express from 'express';
import flash from 'connect-flash';
import {engine} from 'express-handlebars';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { seleccionarSkills, tipoContrato, mostrarAlertas}  from './helpers/handlebars.js';
import createError from 'http-errors';
import passport from './config/passport.js';

import MongoStore from 'connect-mongo';

import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Settings
app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'layout',
    helpers: {seleccionarSkills, tipoContrato, mostrarAlertas}
}));



app.set('view engine', 'handlebars');

// static files
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router);
// 404 page
app.use((req, res, next) => {
    next(createError(404, 'No encontrado'));
});

// Administración de los errores
app.use((error, req, res, next) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
})

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
    console.log(`Server is running on port ${puerto}`);
});