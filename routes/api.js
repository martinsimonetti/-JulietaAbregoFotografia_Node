var express = require('express');
var router = express.Router();
var galeriaModel = require('./../models/galeriaModel');
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* GET home page. */
router.get('/galeria', async function (req, res, next) {
    let galeria = await galeriaModel.getFotos();

    console.log(galeria);

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

module.exports = router;