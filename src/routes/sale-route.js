const express = require('express');
const saleController = require('../controllers/sale-controller');
const { requireAuth } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', requireAuth, saleController.findAll);
router.get('/:id', requireAuth, saleController.findById);
router.post('/', requireAuth, saleController.save);
router.put('/:id/status', requireAuth, saleController.updateStatus);

module.exports = router;
