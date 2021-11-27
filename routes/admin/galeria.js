var express = require('express');
var router = express.Router();
var galeriaModel = require('../../models/galeriaModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploader = util.promisify(cloudinary.uploader.upload);

/* GET home page. */
router.get('/', async function (req, res, next) {
  var galeria = await galeriaModel.getFotos();

  galeria = galeria.map(foto => {
    if (foto.url_foto) {
      const imagen = cloudinary.image(foto.url_foto, {
        width: 1440,
        height: 1080,
        crop: 'fill',
        class: 'w-100 h-100 mb-4 card-img-top'
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
  })

  res.render('admin/galeria', {
    layout: 'admin/layout',
    galeria
  });
});

router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout',
  });
});

router.post('/agregar', async (req, res, next) => {
  try {
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      var url_foto = (await uploader(imagen.tempFilePath)).public_id;
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Debe incluir una imagen para continuar.'
      });
    }
    if (req.body.titulo != '' && req.body.descripcion != '') {
        await galeriaModel.insertFoto({
          ...req.body,
          url_foto
        });
        res.redirect('/admin/galeria');
      } else {
        res.render('admin/agregar', {
          layout: 'admin/layout',
          error: true,
          message: 'Todos los campos son requeridos.'
        });
      }
    } catch (error) {
      console.log(error);
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'No se pudo agregar la foto a la galería. ' + error
      });
    }
  });

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  await galeriaModel.deleteFotoById(id);

  res.redirect('/admin/galeria');
});

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;

  var foto = await galeriaModel.getFotoById(id);

  console.log(foto);

  res.render('admin/modificar', {
    layout: 'admin/layout',
    foto
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
    var id = req.body.id;

    if (req.body.titulo != '' && req.body.descripcion != '') {
      var obj = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion
      };
      await galeriaModel.updateFotoById(obj, id);
      res.redirect('/admin/galeria');
    } else {
      res.render('admin/modificar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos.',
        id
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo modificar la foto. ' + error,
      id
    });
  }
});

module.exports = router;
