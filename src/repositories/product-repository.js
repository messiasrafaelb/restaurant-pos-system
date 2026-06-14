const pool = require('../config/db');

async function save(product){
    const query = "INSERT INTO product (name, status, minimum_stock, quantity_stock, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    try {
        
        const values = [
            product.name,
            product.status,
            product.minimum_stock,
            product.quantity_stock,
            product.created_at
        ];

        const data = await pool.query(query, values);
        return data.rows[0];

    } catch (err) {
        console.error(err.message);
    }
}

async function findAll(filters = {}){
    let query = "SELECT * FROM product WHERE 1=1";
    values = [];

    if(filters.name){
        values.push(`%${filters.name}%`);
        query += ` AND name ILIKE $${values.length}`;
    }

    if(filters.status){
        values.push(`${filters.status}%`);
        query += ` AND status ILIKE $${values.length}`;
    }

    if(filters.createdAt){
        values.push(`%${filters.createdAt}%`);
        query += ` AND DATE(created_at) = DATE($${values.length})`;
    }

    if(filters.minimum){
        query += ` AND quantity_stock <= minimum_stock`;
    }

    try {
        console.log(query);
        const data = await pool.query(query, values);
        return data.rows;
    } catch (err) {
        console.error(err.message)
    }
}

async function findById(id){
    const query = "SELECT * FROM product WHERE id = $1";
    const values = [id]
    try {
        const data = pool.query(query, values);
        return (await data).rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function updateStatus(id, status){
    const query = "UPDATE PRODUCT SET STATUS = $1 WHERE ID = $2 RETURNING *";
    const values = [status, id];
    try {
        const data = pool.query(query, values);
        return (await data).rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
}





