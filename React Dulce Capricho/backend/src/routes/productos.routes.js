const router = require('express').Router();
const verificarToken = require('../middlewares/verificartoken');
const soloAdmin = require('../middlewares/soloAdmin');
const { listar, crear, actualizar, cambiarEstado } = require('../controllers/productos.controller');

// Todas las rutas de aqui exigen token valido y rol Administrador
router.use(verificarToken, soloAdmin);

router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.patch('/:id/estado', cambiarEstado);

module.exports = router;