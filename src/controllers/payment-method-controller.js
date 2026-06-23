const service = require("../services/payment-method-service");
const paymentMethodFilter = require('../repositories/filters/payment-method-filter');

async function findAll(req, res, next) {
  try {
    const filters = paymentMethodFilter.parseQuery(req.query);
    const paymentMethods = await service.findAll(filters);
    return res.render("payment-methods-list", { paymentMethods, filters });
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