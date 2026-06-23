const pool = require("../config/db");
const customerFilter = require("./filters/customer-filter");
const customerModel = require("../models/customer-model");

async function findAll(filters = {}) {
  const { query, values } = customerFilter.build(filters);
  const result = await pool.query(query, values);
  return result.rows;
}

async function findById(id) {
  const query = `SELECT * FROM CUSTOMER WHERE ID = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function save(customer) {
  const query = `
    INSERT INTO CUSTOMER (NAME, PHONE, DOCUMENT) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const values = customerModel.toPoolParams(customer);
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = { findAll, findById, save };