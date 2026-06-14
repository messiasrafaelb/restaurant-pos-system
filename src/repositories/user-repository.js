const pool = require("../config/db");

async function findAll(filters = {}) {
    let query = `SELECT id, name, email, role, status, created_at FROM USERS WHERE 1=1`;

    const values = [];

    if (filters.name) {
        values.push(`%${filters.name}%`);
        query += ` AND NAME ILIKE $${values.length}`;
    }

    if (filters.role) {
        values.push(`%${filters.role}%`);
        query += ` AND ROLE ILIKE $${values.length}`;
    }

    if (filters.status) {
        values.push(`${filters.status}%`);
        query += ` AND STATUS ILIKE $${values.length}`;
    }

    if (filters.created_at) {
        values.push(`%${filters.created_at}%`);
        query += ` AND DATE(CREATED_AT) = DATE($${values.length})`;
    }

    const result = await pool.query(query, values);

    return result.rows;
}

async function findById(id) {
    const query = `SELECT * FROM USERS WHERE id = $1`;
    const result = await pool.query(query, [id]);

    return result.rows[0];
}

async function save(user) {
    const values = [
        user.name,
        user.email,
        user.password,
        user.role,
        user.status
    ]

    const query = `INSERT INTO USERS (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, values);

    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
    save,
};