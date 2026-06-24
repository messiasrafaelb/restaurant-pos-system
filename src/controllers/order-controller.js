const service = require("../services/order-service");
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const orders = await service.findAll();
    return res.render("orders-list", { orders },);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const order = await service.findByIdOrThrow(id);
    return res.render("order-detail", { order });
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) {
      throw new AppError('O código identificador do pedido é obrigatório.', 400);
    }
    await service.save(req.body);
    return res.redirect("/luizao/orders");
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };