const express = require('express');
const productController = require('../controllers/product-controller');
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', requireAuth, productController.findAll);
router.get('/:id', requireAuth, productController.findById);
router.post('/', requireAuth, requireRole('ADMIN'), productController.save);
router.put('/:id', requireAuth, requireRole('ADMIN'), productController.updateStatus);
router.delete('/:id', requireAuth, requireRole('ADMIN'), productController.softDelete);

module.exports = router;
