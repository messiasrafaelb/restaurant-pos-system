const express = require("express");
const controller = require("../controllers/customer-controller");
const { requireAuth } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get("/", requireAuth, controller.findAll);
router.get("/:id", requireAuth, controller.findById);
router.post("/register", requireAuth, controller.save);

module.exports = router;