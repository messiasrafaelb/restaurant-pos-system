const pool = require("../config/db");
const userFilter = require("./filters/user-filter");
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
    INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE, STATUS) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *
  `;
    const values = userModel.toPoolParams(user);
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = { findById, findByEmail, save };