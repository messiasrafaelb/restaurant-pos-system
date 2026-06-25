const repository = require('../repositories/sale-repository');
const saleModel = require('../models/sale-model');
const saleDto = require('../dtos/sale-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Venda não encontrada.";

async function findAll(filters = {}) {
  const sales = await repository.findAll(filters);
  return sales.map(saleDto.toResponse);
}

async function findByIdOrThrow(id) {
  const sales = await repository.findById(id);

  if (!sales) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }

  return saleDto.toResponse(sales);
}

async function save(request) {
  const saleEntity = saleModel.toEntity(request);
  const savedSale = await repository.save(saleEntity);

  if (request.products && Array.isArray(request.products)) {
    for (const prod of request.products) {
      await repository.saveSaleProduct(savedSale.id, prod.id, prod.quantity, prod.price);
    }
  }

  return saleDto.toResponse(savedSale);
}

async function update(request) {
  const sale = findByIdOrThrow(request.id);
  const saleEntity = saleModel.toEntity(request);
  const updatedSale = await repository.update(saleEntity);
  return saleDto.toResponse(updatedSale);
}

async function deleteById(id) {
  await repository.deleteById(id);
}

module.exports = { findAll, findByIdOrThrow, save, update, deleteById };