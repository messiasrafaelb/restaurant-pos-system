const service = require("../services/customer-service");
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const customers = await service.findAll();
    return res.status(200).json(customers);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const customer = await service.findByIdOrThrow(id);
    return res.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      throw new AppError('O nome do cliente é obrigatório.', 400);
    }
    const result = await service.save(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };