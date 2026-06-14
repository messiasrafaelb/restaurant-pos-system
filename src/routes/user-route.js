const express = require("express");

const controller = require("../controllers/user-controller");
const router = express.Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", controller.save);

module.exports = router;