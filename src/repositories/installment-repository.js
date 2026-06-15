const pool = require('../config/db');
const { Installment } = require('../models/installment-model');
const InstallmentFilter = require('./filters/installment-filter');

async function save(installment) {
    const values = Installment.toDbParams(installment);
    const query = `
        INSERT INTO INSTALLMENT
        (NUMBER, AMOUNT, DUE_DATE, FK_SALE, FK_PAYMENT_METHOD, STATUS, CREATED_AT)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;

    const data = await pool.query(query, values);

    return data.rows[0] ? Installment.from(data.rows[0]) : null;
}

async function findAll(filters = {}) {
    const { query, values } = InstallmentFilter.build(filters);
    const data = await pool.query(query, values);

    return data.rows.map(Installment.from);
}

async function findById(id) {
    const query = 'SELECT * FROM INSTALLMENT WHERE ID = $1';
    const values = [id];

    const data = await pool.query(query, values);

    return data.rows[0] ? Installment.from(data.rows[0]) : null;
}

async function updateStatus(id, status) {
    const query = 'UPDATE INSTALLMENT SET STATUS = $1 WHERE ID = $2 RETURNING *';
    const values = [status, id];

    const data = await pool.query(query, values);
    
    return data.rows[0] ? Installment.from(data.rows[0]) : null;
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
};
