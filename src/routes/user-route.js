const express = require("express");
const controller = require("../controllers/user-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post("/", controller.save);
router.get("/:id", requireAuth, requireRole('ADMIN'), controller.findById);

module.exports = router;