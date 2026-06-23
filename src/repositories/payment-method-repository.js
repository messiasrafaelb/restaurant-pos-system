const pool = require("../config/db");
const PaymentMethodFilter = require("./filters/payment-method-filter");
const { PaymentMethod } = require("../models/payment-method-model");

async function findAll(filters = {}) {
    const { query, values } = PaymentMethodFilter.build(filters);
    const result = await pool.query(query, values);

    return result.rows.map(row => PaymentMethod.from(row));
}

async function findById(id) {
    const query = `SELECT * FROM PAYMENT_METHOD WHERE ID = $1`;
    const result = await pool.query(query, [id]);

    return result.rows[0] ? PaymentMethod.from(result.rows[0]) : null;
}

async function inactivate(id) {
    const query = `UPDATE PAYMENT_METHOD SET STATUS = 'INATIVO' WHERE ID = $1 RETURNING *`;
    const result = await pool.query(query, [id]);

    return result.rows[0] ? PaymentMethod.from(result.rows[0]) : null;
}

async function findByCode(code) {
    const query = `SELECT * FROM PAYMENT_METHOD WHERE CODE = $1 LIMIT 1`;
    const result = await pool.query(query, [code]);
    return result.rows[0] ? PaymentMethod.from(result.rows[0]) : null;
}

module.exports = {
    findAll,
    findById,
    findByCode,
    inactivate
}