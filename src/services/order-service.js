const pool = require('../config/db');
const repository = require('../repositories/order-repository');
const orderItemRepository = require('../repositories/order-item-repository');
const saleRepository = require('../repositories/sale-repository');
const installmentRepository = require('../repositories/installment-repository');
const paymentMethodRepository = require('../repositories/payment-method-repository');
const { OrderDTO } = require('../dtos/order-dto');
const { OrderItem } = require('../models/order-item-model');
const { Sale } = require('../models/sale-model');
const { Installment } = require('../models/installment-model');
const OrderFilter = require('../repositories/filters/order-filter');

const MSG_ORDER_NOT_FOUND = 'Ordem não encontrada.';

// Map from UI method names (sent by frontend) to payment method codes seeded in DB
const PAYMENT_METHOD_CODE = {
  'Dinheiro':          '01',
  'Cartão - Crédito':  '02',
  'Cartão - Débito':   '03',
  'Pix':               '04'
};

async function save(entity) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Auto-generate code when not provided
    const code = entity.code || `PED-${Date.now()}`;

    const savedOrder = await repository.saveWithClient({ ...entity, code }, client);

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

    // Persist sale linked to this order
    const saleEntity = Sale.from({
      amount: entity.amount || 0,
      discount: entity.discount || 0,
      status: 'ATIVO',
      created_at: new Date(),
      fk_order: savedOrder.id,
      fk_user: entity.fkUser || null
    });
    const savedSale = await saleRepository.saveWithClient(saleEntity, client);

    // Persist installment when a payment method is provided
    if (entity.paymentMethodCode || entity.paymentMethodId) {
      let pmId = entity.paymentMethodId;

      if (!pmId && entity.paymentMethodCode) {
        const pmCode = PAYMENT_METHOD_CODE[entity.paymentMethodCode] || entity.paymentMethodCode;
        const pm = await paymentMethodRepository.findByCode(pmCode);
        pmId = pm ? pm.id : null;
      }

      if (pmId) {
        const installment = Installment.from({
          number: 1,
          amount: entity.amount || 0,
          dueDate: new Date(),
          saleId: savedSale.id,
          paymentMethodId: pmId,
          status: 'ATIVO',
          createdAt: new Date()
        });
        await installmentRepository.saveWithClient(installment, client);
      }
    }

    await client.query('COMMIT');

    const orderDto = OrderDTO.fromModel(savedOrder);
    orderDto.saleId = savedSale.id;
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
  const rows = await repository.findAllWithItems(filters);

  const ordersMap = new Map();
  for (const row of rows) {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        id: row.order_id,
        code: row.order_code,
        observations: row.order_obs,
        status: row.order_status,
        createdAt: row.order_created_at ? new Date(row.order_created_at).toISOString() : null,
        items: []
      });
    }
    if (row.oi_id) {
      ordersMap.get(row.order_id).items.push({
        quantity: Number(row.oi_quantity),
        amount: Number(row.oi_amount),
        itemId: row.item_id,
        itemName: row.item_name,
        itemPrice: Number(row.item_price)
      });
    }
  }

  return Array.from(ordersMap.values());
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
