
import './config/db.js';
import express from 'express';
import exhbs from 'express-handlebars';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// pasar la sesion a la base de datos

import MongoStore from 'connect-mongo';

import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const app = express();

// Settings
app.engine('handlebars', exhbs.engine({
    defaultLayout: 'layout'
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

app.use('/', router);

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
    console.log(`Server is running on port ${puerto}`);
});