const express = require('express');
const itemController = require('../controllers/item-controller');
const { authMiddleware, requireRole } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN', 'ATTENDANT'));

router.get("/", itemController.findAll);
router.get("/:id", itemController.findById);
router.post("/", itemController.save);
router.put("/:id", itemController.updateStatus);

module.exports = router;

