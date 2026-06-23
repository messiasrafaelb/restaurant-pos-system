const repository = require('../repositories/order-repository');
const orderModel = require('../models/order-model');
const orderDto = require('../dtos/order-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Pedido não encontrado.";
const MSG_CODE_EXISTS = "Código de pedido já cadastrado.";

async function findAll(filters = {}) {
  const items = await repository.findAll(filters);
  return items.map(orderDto.toResponse);
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);
  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  return orderDto.toResponse(item);
}

async function save(request) {
  const existing = await repository.findByCode(request.code);
  if (existing) {
    throw new AppError(MSG_CODE_EXISTS, 400);
  }

  const order = orderModel.toEntity(request);
  const saved = await repository.save(order);
  return orderDto.toResponse(saved);
}

module.exports = {
  findAll,
  findByIdOrThrow,
  save
};