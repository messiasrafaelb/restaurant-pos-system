const pool = require("../config/db");
const orderFilter = require("./filters/order-filter");
const orderModel = require("../models/order-model");

async function findAll(filters = {}) {
  const { query, values } = orderFilter.build(filters);
  const result = await pool.query(query, values);
  return result.rows;
}

async function findById(id) {
  const query = `SELECT * FROM ORDERS WHERE ID = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function findByCode(code) {
  const query = `SELECT * FROM ORDERS WHERE CODE = $1`;
  const result = await pool.query(query, [code]);
  return result.rows[0] || null;
}

async function save(order) {
  const query = `
    INSERT INTO ORDERS (CODE, OBSERVATIONS, ORDER_STATUS) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const values = orderModel.toPoolParams(order);
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = { findAll, findById, findByCode, save };