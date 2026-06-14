const repository = require('../repositories/order-repository');
const { Order } = require('../models/order-model');

const MSG_ORDER_NOT_FOUND = 'Ordem não encontrada.';

async function save(request) {
    const order = new Order({
        code: request.code,
        status: request.order_status ?? request.status ?? 'OPEN',
        created_at: new Date(),
        observations: request.observations ?? null,
    });

    return repository.save({
        code: order.code,
        observations: order.observations,
        order_status: order.status,
        created_at: order.created_at,
    });
}

async function findAll(filters = {}) {
    return repository.findAll(filters);
}

async function findByIdOrThrow(id) {
    const data = await repository.findById(id);

    if (!data) {
        throw new Error(MSG_ORDER_NOT_FOUND);
    }

    return data;
}

async function updateStatus(id, status) {
    await findByIdOrThrow(id);

    return repository.updateStatus(id, status);
}

module.exports = {
    save,
    findAll,
    findByIdOrThrow,
    updateStatus,
};
