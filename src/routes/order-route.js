const express = require('express');
const controller = require('../controllers/order-controller');

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.save);
router.put('/:id', controller.updateStatus);

module.exports = router;
