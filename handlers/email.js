import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import util from 'util';
import path from 'path';

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/emails'),
    extName: '.handlebars'
    
}));

const enviarEmail = async (opciones) => {
    const opcionesEmail = {
        from: 'devJobs <noreplay@slizerjobs.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }
    }

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail);
}


export { enviarEmail };