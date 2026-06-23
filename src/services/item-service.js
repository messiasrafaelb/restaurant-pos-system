const pool = require('../config/db');
const itemRepository = require('../repositories/item-repository');
const productItemRepository = require('../repositories/product-item-repository');
const { Item } = require('../models/item-model');
const { ItemDTO } = require('../dtos/item-dto');

const MSG_ITEM_NOT_FOUND = "Item não encontrado";

async function save(request) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const item = Item.from(request);
    const itemResult = await itemRepository.save(item, client);

    if (!itemResult) {
      throw new Error('Falha ao salvar item');
    }

    const products = request.products || [];
    for (const product of products) {
      const { quantity, productId } = product;
      await productItemRepository.save(itemResult.id, productId, quantity, client);
    }

    await client.query('COMMIT');
    return ItemDTO.fromModel(itemResult);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function findAll(filters = {}) {
  const rows = await itemRepository.findAll(filters);
  return ItemDTO.fromRows(rows);
}

async function findByIdOrThrow(id) {
  const rows = await itemRepository.findById(id);
  if (!rows || rows.length === 0) {
    const err = new Error(MSG_ITEM_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  return ItemDTO.fromRows(rows)[0];
}

async function updateStatus(id) {
  const rows = await itemRepository.findById(id);
  if (!rows || rows.length === 0) {
    const err = new Error(MSG_ITEM_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  const currentStatus = rows[0].item_status || rows[0].status;
  const nextStatus = currentStatus.toLowerCase() === 'ativo' ? 'INATIVO' : 'ATIVO';
  const data = await itemRepository.updateStatus(id, nextStatus);
  return ItemDTO.fromModel(data);
}

async function softDelete(id) {
  const rows = await itemRepository.findById(id);
  if (!rows || rows.length === 0) {
    const err = new Error(MSG_ITEM_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  const data = await itemRepository.updateStatus(id, 'INATIVO');
  return ItemDTO.fromModel(data);
}

async function updateProducts(id, products) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const rows = await itemRepository.findById(id);
    if (!rows || rows.length === 0) {
      const err = new Error(MSG_ITEM_NOT_FOUND);
      err.status = 404;
      throw err;
    }

    await productItemRepository.deleteByItemId(id, client);

    for (const product of products) {
      await productItemRepository.save(id, product.productId, product.quantity, client);
    }

    await client.query('COMMIT');

    const updatedRows = await itemRepository.findById(id);
    return ItemDTO.fromRows(updatedRows)[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  save,
  findAll,
  findByIdOrThrow,
  updateStatus,
  softDelete,
  updateProducts
};
