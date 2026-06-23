const pool = require('../config/db');
const ProductFilter = require('./filters/product-filter');
const { Product } = require('../models/product-model');

async function save(product) {
    const query = `
    INSERT INTO PRODUCT
    (NAME, STATUS, MINIMUM_STOCK, QUANTITY_STOCK, CREATED_AT)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const values = Product.toDbParams(product);

    const data = await pool.query(query, values);

    return data.rows[0] ? Product.from(data.rows[0]) : null;
}

async function findAll(filters = {}) {
    const { query, values } = ProductFilter.build(filters);

    const data = await pool.query(query, values);

    return data.rows.map(Product.from);
}

async function findById(id) {
    const query = "SELECT * FROM PRODUCT WHERE ID = $1";
    const values = [id];

    const data = await pool.query(query, values);

    return data.rows[0] ? Product.from(data.rows[0]) : null;
}

async function updateStatus(id, status) {
    const query = "UPDATE PRODUCT SET STATUS = $1 WHERE ID = $2 RETURNING *";
    const values = [status, id];

    const data = await pool.query(query, values);

    return data.rows[0] ? Product.from(data.rows[0]) : null;
}

async function findByName(name) {
    const query = "SELECT * FROM PRODUCT WHERE NAME ILIKE $1"; 
    const values = [name];

    const data = await pool.query(query, values);

    return data.rows[0] ? Product.from(data.rows[0]) : null;
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus,
    findByName
}