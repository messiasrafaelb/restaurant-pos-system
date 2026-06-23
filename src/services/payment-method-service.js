const repository = require('../repositories/payment-method-repository');
const paymentMethodDto = require('../dtos/payment-method-dto');
const AppError = require('../errors/app-error');

const MSG_NOT_FOUND = "Forma de pagamento não encontrada.";

async function findAll() {
  const items = await repository.findAll();
  return items.map(paymentMethodDto.toResponse);
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);
  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  return paymentMethodDto.toResponse(item);
}

module.exports = {
  findAll,
  findByIdOrThrow
};