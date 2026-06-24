const pool = require("../config/db");
const userModel = require("../models/user-model");

async function findById(id) {
    const query = `SELECT * FROM USERS WHERE ID = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function findByEmail(email) {
    const query = `SELECT * FROM USERS WHERE EMAIL = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
}

async function save(user) {
    const query = `
    INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
    const values = userModel.toPoolParams(user);
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function update(user) {
    const query = `
    UPDATE USERS SET
    NAME = $1,
    EMAIL = $2,
    PASSWORD = $3,
    WHERE id = $4 RETURNING *
  `;
    const values = userModel.toPoolParams(user);
    const result = await pool.query(query, values);
    return result.rows[0];

}

async function remove(id) {
    const query = `
    DELETE FROM users WHERE id = $1 RETURNING *
  `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = { findById, findByEmail, save, update, remove };