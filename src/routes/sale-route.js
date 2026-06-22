const express = require('express');
const saleController = require('../controllers/sale-controller');
const { authMiddleware, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'ATTENDANT'));

router.get('/', saleController.findAll);
router.get('/:id', saleController.findById);
router.post('/', saleController.save);
router.put('/:id/status', saleController.updateStatus);

module.exports = router;
