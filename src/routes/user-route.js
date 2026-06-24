const express = require("express");
const controller = require("../controllers/user-controller");
const { requireAuth, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post("/", controller.save);
router.get("/:id", requireAuth, requireRole('ADMIN'), controller.findById);
router.delete("/:id", requireAuth, requireRole('ADMIN'), controller.remove);
router.put("/", requireAuth, requireRole('ADMIN'), controller.update);

module.exports = router;