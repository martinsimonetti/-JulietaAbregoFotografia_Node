var express = require('express');
var router = express.Router();
var galeriaModel = require('../../models/galeriaModel');

/* GET home page. */
router.get('/', async function (req, res, next) {
  var galeria = await galeriaModel.getFotos();

  //console.log(galeria);

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
    if (req.body.titulo != '' && req.body.descripcion != '') {
      await galeriaModel.insertFoto({
        ...req.body
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

module.exports = router;
