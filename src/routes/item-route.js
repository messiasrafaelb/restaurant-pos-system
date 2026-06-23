const express = require('express');
const itemController = require('../controllers/item-controller');
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', requireAuth, itemController.findAll);
router.get('/:id', requireAuth, itemController.findById);
router.post('/', requireAuth, requireRole('ADMIN'), itemController.save);
router.put('/:id/products', requireAuth, requireRole('ADMIN'), itemController.updateProducts);
router.put('/:id', requireAuth, requireRole('ADMIN'), itemController.updateStatus);
router.delete('/:id', requireAuth, requireRole('ADMIN'), itemController.softDelete);

module.exports = router;
