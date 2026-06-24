const pool = require("../config/db");

async function findAll() {
  const query = `SELECT * FROM PAYMENT_METHOD`;
  const result = await pool.query(query);
  return result.rows;
}

async function findById(id) {
  const query = `SELECT * FROM PAYMENT_METHOD WHERE ID = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = { findAll, findById };