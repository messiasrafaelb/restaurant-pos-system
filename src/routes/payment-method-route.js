const express = require("express");

const controller = require("../controllers/payment-method-controller");
const { authMiddleware, requireRole } = require('../middlewares/auth-middleware');
const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id/inactivate", controller.inactivate);

module.exports = router;