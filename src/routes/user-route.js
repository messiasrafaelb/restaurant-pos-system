const express = require("express");
const controller = require("../controllers/user-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post("/login", controller.login);
router.post("/register", controller.save);
router.get("/", requireAuth, requireRole('ADMIN'), controller.findAll);
router.get("/:id", requireAuth, controller.findById);

module.exports = router;
