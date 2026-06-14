const express = require("express");

const controller = require("../controllers/payment-method-controller");
const router = express.Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id/inactivate", controller.inactivate);

module.exports = router;