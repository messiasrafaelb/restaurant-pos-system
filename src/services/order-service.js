const repository = require('../repositories/order-repository');
const { OrderDTO } = require('../dtos/order-dto');

const MSG_ORDER_NOT_FOUND = 'Ordem não encontrada.';

async function save(entity) {
  const saved = await repository.save(entity);
  return OrderDTO.fromModel(saved);
}

async function findAll(filters = {}) {
  const orders = await repository.findAll(filters);
  return orders.map(OrderDTO.fromModel);
}

async function findByIdOrThrow(id) {
  const order = await repository.findById(id);

  if (!order) {
    const err = new Error(MSG_ORDER_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  return OrderDTO.fromModel(order);
}

async function updateStatus(id, status) {
  await findByIdOrThrow(id);
  const updated = await repository.updateStatus(id, status);
  return OrderDTO.fromModel(updated);
}

module.exports = {
  save,
  findAll,
  findByIdOrThrow,
  updateStatus
};
