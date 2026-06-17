const saleRepository = require('../repositories/sale-repository');
const { Sale } = require('../models/sale-model');
const { SaleDTO } = require('../dtos/sale-dto');

const MSG_SALE_NOT_FOUND = 'Sale não encontrada';

async function save(request) {
  const entity = Sale.from(request);
  const saved = await saleRepository.save(entity);
  return SaleDTO.fromModel(saved);
}

async function findAll(filters = {}) {
  const sales = await saleRepository.findAll ? await saleRepository.findAll(filters) : [];
  return sales.map(SaleDTO.fromModel);
}

async function findByIdOrThrow(id) {
  const data = await saleRepository.findById(id);
  if (!data) {
    const err = new Error(MSG_SALE_NOT_FOUND);
    err.status = 404;
    throw err;
  }
  return SaleDTO.fromModel(data);
}

async function updateStatus(id, status) {
  const updated = await saleRepository.updateStatus(id, status);
  return SaleDTO.fromModel(updated);
}

module.exports = {
  save,
  findAll,
  findByIdOrThrow,
  updateStatus
};
