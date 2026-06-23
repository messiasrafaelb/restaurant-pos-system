const pool = require("../config/db");
const productFilter = require("./filters/product-filter");
const productModel = require("../models/product-model");

async function findAll(filters = {}) {
  const { query, values } = productFilter.build(filters);
  const result = await pool.query(query, values);
  return result.rows;
}

async function findById(id) {
  const query = `SELECT * FROM PRODUCT WHERE ID = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function save(product) {
  const query = `
    INSERT INTO PRODUCT (NAME, PRICE, UNIT_MEASURE, STATUS) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const values = productModel.toPoolParams(product);
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = { findAll, findById, save };