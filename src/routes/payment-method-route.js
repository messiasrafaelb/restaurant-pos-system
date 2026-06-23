const express = require("express");
const controller = require("../controllers/payment-method-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get("/", requireAuth, controller.findAll);
router.get("/:id", requireAuth, controller.findById);
router.put("/:id/inactivate", requireAuth, requireRole('ADMIN'), controller.inactivate);

module.exports = router;
