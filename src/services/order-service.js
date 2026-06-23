const pool = require('../config/db');
const repository = require('../repositories/order-repository');
const orderItemRepository = require('../repositories/order-item-repository');
const { OrderDTO } = require('../dtos/order-dto');
const { OrderItem } = require('../models/order-item-model');

const MSG_ORDER_NOT_FOUND = 'Ordem não encontrada.';

async function save(entity) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const savedOrder = await repository.saveWithClient(entity, client);

    const items = entity.items || [];
    for (const item of items) {
      const orderItem = OrderItem.from({
        quantity: item.quantity,
        amount: item.amount,
        fk_order: savedOrder.id,
        fk_item: item.itemId
      });
      await orderItemRepository.save(orderItem, client);
    }

    await client.query('COMMIT');

    const orderDto = OrderDTO.fromModel(savedOrder);
    orderDto.items = items;
    return orderDto;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
