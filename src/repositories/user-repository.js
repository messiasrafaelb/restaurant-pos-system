const pool = require("../config/db");
const UserFilter = require("./filters/user-filter");
const { User } = require("../models/user-model");

async function findAll(filters = {}) {
    const { query, values } = UserFilter.build(filters);

    const result = await pool.query(query, values);
    return result.rows;
}

async function findById(id) {
    const query = `SELECT * FROM USERS WHERE ID = $1`;
    const result = await pool.query(query, [id]);

    return result.rows[0];
}

async function save(user) {
    const query = `INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE, STATUS) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = User.toDbParams(user);
    const result = await pool.query(query, values);

    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
    save,
};