const pool = require('../config/db');
const OrderFilter = require('./filters/order-filter');
const { Order } = require('../models/order-model');

async function save(order) {
  const query = `INSERT INTO ORDERS (CODE, OBSERVATIONS, ORDER_STATUS, CREATED_AT) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = Order.toDbParams(order);

  const data = await pool.query(query, values);
  return data.rows[0] ? Order.from(data.rows[0]) : null;
}

async function saveWithClient(order, client) {
  const query = `INSERT INTO ORDERS (CODE, OBSERVATIONS, ORDER_STATUS, CREATED_AT) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = Order.toDbParams(order);

  const data = await client.query(query, values);
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

async function findAllWithItems(filters = {}) {
  let query = `
    SELECT
      O.ID          AS order_id,
      O.CODE        AS order_code,
      O.OBSERVATIONS AS order_obs,
      O.ORDER_STATUS AS order_status,
      O.CREATED_AT   AS order_created_at,
      OI.ID          AS oi_id,
      OI.QUANTITY    AS oi_quantity,
      OI.AMOUNT      AS oi_amount,
      I.ID           AS item_id,
      I.NAME         AS item_name,
      I.PRICE        AS item_price
    FROM ORDERS O
    LEFT JOIN ORDER_ITEM OI ON OI.FK_ORDER = O.ID
    LEFT JOIN ITEM I ON I.ID = OI.FK_ITEM
    WHERE 1=1
  `;
  const values = [];

  if (filters.code) {
    values.push(`%${filters.code}%`);
    query += ` AND O.CODE ILIKE $${values.length}`;
  }
  if (filters.status) {
    values.push(`%${filters.status}%`);
    query += ` AND O.ORDER_STATUS ILIKE $${values.length}`;
  }
  if (filters.createdAt) {
    values.push(filters.createdAt);
    query += ` AND DATE(O.CREATED_AT) = DATE($${values.length})`;
  }

  query += ' ORDER BY O.CREATED_AT DESC';

  const data = await pool.query(query, values);
  return data.rows;
}

module.exports = {
  save,
  saveWithClient,
  findAll,
  findAllWithItems,
  findById,
  updateStatus
};