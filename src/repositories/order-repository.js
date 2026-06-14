const pool = require('../config/db');
const OrderFilter = require('./filters/order-filter');
const { Order } = require('../models/order-model');

async function save(order) {
  const query = `INSERT INTO ORDERS (CODE, OBSERVATIONS, ORDER_STATUS, CREATED_AT) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = Order.toDbParams(order);

  const data = await pool.query(query, values);
  return data.rows[0] ? Order.from(data.rows[0]) : null;
}

async function findAll(filters = {}) {
  const { query, values } = OrderFilter.build(filters);
  const data = await pool.query(query, values);
  return data.rows.map(Order.from);
}

async function findById(id) {
  const query = `SELECT * FROM ORDERS WHERE ID = $1`;
  const data = await pool.query(query, [id]);
  return data.rows[0] ? Order.from(data.rows[0]) : null;
}

async function updateStatus(id, status) {
  const query = `UPDATE ORDERS SET ORDER_STATUS = $1 WHERE ID = $2 RETURNING *`;
  const data = await pool.query(query, [status, id]);
  return data.rows[0] ? Order.from(data.rows[0]) : null;
}

module.exports = {
  save,
  findAll,
  findById,
  updateStatus
};