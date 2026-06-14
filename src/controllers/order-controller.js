const orderService = require('../services/order-service');
const OrderFilter = require('../repositories/filters/order-filter');
const { OrderDTO } = require('../dtos/order-dto');

async function save(req, res, next) {
  try {
    if (!req.body || !req.body.code) {
      const err = new Error('Código do pedido é obrigatório');
      err.status = 400;
      throw err;
    }

    const entity = OrderDTO.toEntity(req.body);
    const response = await orderService.save(entity);

    return res.status(201).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function findById(req, res, next) {
  try {
    const { id } = req.params;
    const response = await orderService.findByIdOrThrow(id);

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const filters = OrderFilter.parseQuery(req.query);
    const response = await orderService.findAll(filters);

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      const err = new Error('Status é obrigatório para atualização');
      err.status = 400;
      throw err;
    }

    const response = await orderService.updateStatus(id, status);

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

module.exports = {
  save,
  findAll,
  findById,
  updateStatus
};