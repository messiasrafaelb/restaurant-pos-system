const express = require('express');
const productController = require('../controllers/product-controller');

const router = express.Router();

router.get("/", productController.findAll);
router.get("/:id", productController.findById);
router.post("/", productController.save);
router.put("/:id", productController.updateStatus);

module.exports = router;

