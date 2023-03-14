import express from 'express';
import exhbs from 'express-handlebars';
import router from './routes/index.js';

const app = express();

// Settings
app.engine('handlebars', exhbs.engine({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

// static files
app.use(express.static('public'));

app.use('/', router);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});