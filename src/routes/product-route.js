const express = require('express');
const productController = require('../controllers/product-controller');
const { authMiddleware, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'ATTENDANT'));

router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.post("/", productController.save);
router.put("/:id", productController.updateStatus);

module.exports = router;

