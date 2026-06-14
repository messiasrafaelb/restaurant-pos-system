const express = require('express');
const itemController = require('../controllers/item-controller');

const router = express.Router();

router.get("/", itemController.findAll);
router.get("/:id", itemController.findById);
router.post("/", itemController.save);
router.put("/:id", itemController.updateStatus);

module.exports = router;

