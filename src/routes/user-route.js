const express = require("express");

const controller = require("../controllers/user-controller");
const repository = require("../repositories/user-repository");
const { authMiddleware, requireRole } = require("../middlewares/auth-middleware");
const router = express.Router();

async function createUser(req, res, next) {
  try {
    const usersCount = await repository.countUsers();

    if (usersCount > 0) {
      return authMiddleware(req, res, (err) => {
        if (err) return next(err);

        return requireRole('ADMIN')(req, res, (roleErr) => {
          if (roleErr) return next(roleErr);
          return controller.save(req, res, next);
        });
      });
    }

    return controller.save(req, res, next);
  } catch (error) {
    return next(error);
  }
}

router.get("/", authMiddleware, requireRole('ADMIN'), controller.findAll);
router.get("/:id", authMiddleware, requireRole('ADMIN'), controller.findById);
router.post("/", createUser);

module.exports = router;