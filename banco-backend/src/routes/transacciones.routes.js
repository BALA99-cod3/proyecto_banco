const router = require('express').Router();
const ctrl   = require('../controllers/transacciones.controller');
const auth   = require('../middleware/auth.middleware');

router.use(auth);
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   ctrl.create);

module.exports = router;
