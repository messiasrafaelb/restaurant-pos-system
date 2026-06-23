const express = require("express");
const controller = require("../controllers/product-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get("/", requireAuth, controller.findAll);
router.get("/:id", requireAuth, controller.findById);
router.post("/", requireAuth, requireRole('ADMIN'), controller.save);

module.exports = router;