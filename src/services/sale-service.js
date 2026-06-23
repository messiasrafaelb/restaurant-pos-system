const repository = require('../repositories/sale-repository');
const saleModel = require('../models/sale-model');
const saleDto = require('../dtos/sale-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Venda não encontrada.";

async function findAll(filters = {}) {
  const items = await repository.findAll(filters);
  return items.map(saleDto.toResponse);
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);

  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  
  return saleDto.toResponse(item);
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

module.exports = { findAll, findByIdOrThrow, save };