const pool = require('../config/db');
const SaleFilter = require('./filters/sale-filter');
const { Sale } = require('../models/sale-model');

async function save(request) {
    const query = 'INSERT INTO sale(amount, discount, status, created_at, fk_order, fk_user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = Sale.toDbParams(request);
    const data = await pool.query(query, values);
    return data.rows[0] ? Sale.from(data.rows[0]) : null;
}

async function findAll(filters = {}) {
    const { query, values } = SaleFilter.build(filters);
    const data = await pool.query(query, values);
    return data.rows.map(Sale.from);
}

async function findById(id) {
    const query = 'SELECT * FROM sale WHERE id = $1';
    const values = [id];
    const data = await pool.query(query, values);
    return data.rows[0] ? Sale.from(data.rows[0]) : null;
}

async function updateStatus(id, status) {
    const query = 'UPDATE sale SET status = $1 WHERE id = $2 RETURNING *';
    const values = [status, id];
    const data = await pool.query(query, values);
    return data.rows[0] ? Sale.from(data.rows[0]) : null;
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
}

