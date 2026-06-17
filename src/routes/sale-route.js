const express = require('express');
const saleController = require('../controllers/sale-controller');

const router = express.Router();

router.get('/', saleController.findAll);
router.get('/:id', saleController.findById);
router.post('/', saleController.save);
router.put('/:id/status', saleController.updateStatus);

module.exports = router;
