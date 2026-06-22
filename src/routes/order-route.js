const express = require('express');
const controller = require('../controllers/order-controller');
const { authMiddleware, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'ATTENDANT'));

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.save);
router.put('/:id', controller.updateStatus);

module.exports = router;
