const repository = require('../repositories/product-repository');
const productModel = require('../models/product-model');
const productDto = require('../dtos/product-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Produto não encontrado.";

async function findAll(filters = {}) {
  const items = await repository.findAll(filters);
  return items.map(productDto.toResponse);
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);
  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  return productDto.toResponse(item);
}

async function save(request) {
  const product = productModel.toEntity(request);
  const saved = await repository.save(product);
  return productDto.toResponse(saved);
}

module.exports = { findAll, findByIdOrThrow, save };