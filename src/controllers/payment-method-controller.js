const service = require("../services/payment-method-service");

async function findAll(req, res, next) {
  try {
    const paymentMethods = await service.findAll();
    return res.render("payment-methods-list", { paymentMethods });
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const paymentMethod = await service.findByIdOrThrow(id);
    return res.render("payment-method-detail", { paymentMethod });
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById };