const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth-middleware");

router.post("/logout", requireAuth, (req, res) => {
  return res.status(200).json({
    message: "Logout realizado com sucesso. Remova o token no cliente."
  });
});

module.exports = router;