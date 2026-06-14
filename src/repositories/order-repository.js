const pool = require('../config/db');

async function save(order){
    const query = "INSERT INTO orders (code, observations, order_status, created_at) VALUES ($1, $2, $3, $4) RETURNING *";

    try {
        const values = [
            order.code,
            order.observations,
            order.order_status,
            order.created_at,
        ];

        const data = await pool.query(query, values);
        return data.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function findAll(filters = {}){
    let query = "SELECT * FROM orders WHERE 1=1";
    const values = [];

    if(filters.code){
        values.push(`%${filters.code}%`);
        query += ` AND code ILIKE $${values.length}`;
    }

    if(filters.orderStatus){
        values.push(`%${filters.orderStatus}%`);
        query += ` AND order_status ILIKE $${values.length}`;
    }

    if(filters.createdAt){
        values.push(filters.createdAt);
        query += ` AND DATE(created_at) = DATE($${values.length})`;
    }

    try {
        const data = await pool.query(query, values);
        return data.rows;
    } catch (err) {
        console.error(err.message);
    }
}

async function findById(id){
    const query = "SELECT * FROM orders WHERE id = $1";
    const values = [id];
    try {
        const data = await pool.query(query, values);
        return data.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function updateStatus(id, status){
    const query = "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *";
    const values = [status, id];
    try {
        const data = await pool.query(query, values);
        return data.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
};