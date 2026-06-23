const express = require('express');
const controller = require('../controllers/order-controller');
const { requireAuth } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', requireAuth, controller.findAll);
router.get('/:id', requireAuth, controller.findById);
router.post('/', requireAuth, controller.save);
router.put('/:id', requireAuth, controller.updateStatus);

module.exports = router;
