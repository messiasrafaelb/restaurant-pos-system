const service = require("../services/payment-method-service");

async function findAll(req, res, next) {
  try {
    const paymentMethods = await service.findAll();
    return res.status(200).json(paymentMethods);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const paymentMethod = await service.findByIdOrThrow(id);
    return res.status(200).json(paymentMethod);
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById };