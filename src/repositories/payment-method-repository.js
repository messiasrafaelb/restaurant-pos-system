const pool = require("../config/db");

async function findAll(filters = {}) {
    let query = `SELECT * FROM PAYMENT_METHOD WHERE 1=1`;
    const values = [];

    if (filters.code) {
        values.push(`%${filters.code}%`);
        query += ` AND CODE ILIKE $${values.length}`
    }

    if (filters.name) {
        values.push(`%${filters.name}%`);
        query += ` AND NAME ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);

    return result.rows;
}

async function findById(id) {
    const query = `SELECT * FROM PAYMENT_METHOD ID = $1`;
    const result = await pool.query(query, [id]);

    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
}