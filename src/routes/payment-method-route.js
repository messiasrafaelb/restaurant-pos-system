const express = require("express");
const controller = require("../controllers/payment-method-controller");
const { requireAuth } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get("/", requireAuth, controller.findAll);
router.get("/:id", requireAuth, controller.findById);

module.exports = router;