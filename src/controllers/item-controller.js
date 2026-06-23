const itemService = require('../services/item-service');
const ItemFilter = require('../repositories/filters/item-filter');

async function save(req, res, next) {
  try {
    if (!req.body || !req.body.name) {
      const err = new Error('Nome do item é obrigatório');
      err.status = 400;
      throw err;
    }
    if (!req.body.price || Number(req.body.price) <= 0) {
      const err = new Error('Preço deve ser maior que zero');
      err.status = 400;
      throw err;
    }

    const response = await itemService.save(req.body);
    res.status(201).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function findById(req, res, next) {
  try {
    const { id } = req.params;
    const response = await itemService.findByIdOrThrow(id);
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const filters = ItemFilter.parseQuery(req.query);
    const response = await itemService.findAll(filters);
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const response = await itemService.updateStatus(id);
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function softDelete(req, res, next) {
  try {
    const { id } = req.params;
    const response = await itemService.softDelete(id);
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

async function updateProducts(req, res, next) {
  try {
    const { id } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      const err = new Error('products deve ser um array');
      err.status = 400;
      throw err;
    }

    const response = await itemService.updateProducts(id, products);
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
}

module.exports = {
  save,
  findAll,
  findById,
  updateStatus,
  softDelete,
  updateProducts
};
