const repository = require('../repositories/customer-repository');
const customerModel = require('../models/customer-model');
const customerDto = require('../dtos/customer-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Cliente não encontrado.";

async function findAll(filters = {}) {
  const items = await repository.findAll(filters);
  return items.map(customerDto.toResponse);
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);
  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  return customerDto.toResponse(item);
}

async function save(request) {
  const customer = customerModel.toEntity(request);
  const saved = await repository.save(customer);
  return customerDto.toResponse(saved);
}

module.exports = { findAll, findByIdOrThrow, save };