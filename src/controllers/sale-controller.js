const service = require("../services/sale-service");
const saleFilter = require('../repositories/filters/sale-filter');
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const filters = saleFilter.parseQuery(req.query);
    const sales = await service.findAll(filters);
    return res.status(200).json(sales);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const sale = await service.findByIdOrThrow(id);
    return res.status(200).json(sale);
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { amount, fkUser } = req.body;
    if (!amount || !fkUser) {
      throw new AppError('Valor total e Usuário são obrigatórios.', 400);
    }
    const sale = await service.save(req.body);
    return res.status(201).json(sale);
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };