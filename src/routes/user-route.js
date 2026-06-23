const express = require("express");
const controller = require("../controllers/user-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get("/", requireAuth, requireRole('ADMIN'), controller.findAll);
router.get("/:id", requireAuth, requireRole('ADMIN'), controller.findById);
router.post("/", requireAuth, requireRole('ADMIN'), controller.save);

module.exports = router;