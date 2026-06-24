const service = require("../services/product-service");
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const products = await service.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const product = await service.findByIdOrThrow(id);
    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      throw new AppError('Nome e Preço do produto são obrigatórios.', 400);
    }
    const result = await service.save(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };