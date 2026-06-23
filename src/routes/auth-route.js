const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth-middleware");
const userController = require("../controllers/user-controller");



router.post("/logout", requireAuth, (req, res) => {
  return res.status(200).json({
    message: "Logout realizado com sucesso. Remova o token no cliente."
  });
});

router.post("/login", userController.login);



module.exports = router;