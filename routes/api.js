var express = require('express');
var router = express.Router();
var galeriaModel = require('./../models/galeriaModel');
var suscriptosModel = require('./../models/suscriptosModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* GET home page. */
router.get('/galeria', async function (req, res, next) {
    let galeria = await galeriaModel.getFotos();

    //console.log(galeria);

    galeria = galeria.map(foto => {
        if (foto.url_foto) {
            const imagen = cloudinary.url(foto.url_foto, {
                width: 1440,
                height: 1080,
                crop: 'fill'
            });
            return {
                ...foto,
                imagen
            }
        } else {
            return {
                ...foto,
                imagen: ''
            }
        }
    });
    res.json(galeria);
});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: req.body.email,
        subject: 'Formulario de Contacto',
        html: `<h1>Julieta Abrego Fotografía</h1>
        <h3>Mensaje generado por el formulario Contacto</h3>
        <p><strong>De: </strong>${req.body.nombre}</p>
        <p><strong>Correo electrónico: </strong>${req.body.email}</p>
        <p><strong>Redes: </strong>${req.body.redes}</p>
        <br>
        <p><strong>Mensaje: </strong>${req.body.mensaje}</p>`
    }

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transport.sendMail(mail);

    res.status(201).json({
        error: false,
        message: 'Mensaje enviado'
    })
});

router.post('/', async (req, res, next) => {
    try {
        await suscriptosModel.insertSuscripto({
            ...req.body
        });
        res.status(201).json({
            error: false,
            message: 'Mensaje enviado'
        });
    } catch (error) {
        console.log(error);
        res.render('/', {
            error: true,
            message: 'No se suscribir, intente nuevamente. ' + error
        });
    }
});

module.exports = router;