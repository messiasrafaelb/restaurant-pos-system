const service = require("../services/sale-service");
const saleFilter = require('../repositories/filters/sale-filter');
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const filters = saleFilter.parseQuery(req.query);
    const sales = await service.findAll(filters);
    return res.render("sales-list", { sales, filters });
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const sale = await service.findByIdOrThrow(id);
    return res.render("sale-detail", { sale });
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { amount, fkOrder, fkUser } = req.body;
    if (!amount || !fkOrder || !fkUser) {
      throw new AppError('Valor total, Pedido e Usuário são obrigatórios.', 400);
    }
    await service.save(req.body);
    return res.redirect("/luizao/sales");
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };