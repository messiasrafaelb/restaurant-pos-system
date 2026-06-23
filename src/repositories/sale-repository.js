const pool = require("../config/db");
const saleFilter = require("./filters/sale-filter");
const saleModel = require("../models/sale-model");

async function findAll(filters = {}) {
  const { query, values } = saleFilter.build(filters);
  const result = await pool.query(query, values);
  return result.rows;
}

async function findById(id) {
  const query = `SELECT * FROM SALE WHERE ID = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function save(sale) {
  const query = `
    INSERT INTO SALE (AMOUNT, DISCOUNT, STATUS, FK_ORDER, FK_USER, FK_PAYMENT_METHOD) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const values = saleModel.toPoolParams(sale);
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function saveSaleProduct(fkSale, fkProduct, quantity, price) {
  const query = `
    INSERT INTO SALE_PRODUCT (FK_SALE, FK_PRODUCT, QUANTITY, PRICE)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await pool.query(query, [fkSale, fkProduct, quantity, price]);
  return result.rows[0];
}

module.exports = { findAll, findById, save, saveSaleProduct };