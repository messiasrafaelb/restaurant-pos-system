const pool = require("../config/db");

async function save(item, client){
    const query = "INSERT INTO ITEM (name, description, price, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    try {
        const values = [
            item.name,
            item.description,
            item.price,
            item.status,
            item.created_at
        ];

        const data = await client.query(query, values);
        return data.rows[0];

    } catch (err) {
        console.error(err.message);
    }
}

async function findAll(filters = {}){
    let query = `
        SELECT
            i.id AS item_id,
            i.name AS item_name,
            i.description AS item_description,
            i.price AS item_price,
            i.status AS item_status,
            i.created_at AS item_created_at,
            p.id AS product_id,
            p.name AS product_name,
            p.status AS product_status,
            pi.quantity AS product_quantity_used,
            p.quantity_stock AS product_quantity
        FROM item i
        LEFT JOIN product_item pi ON pi.fk_item = i.id
        LEFT JOIN product p ON p.id = pi.fk_product
        WHERE 1=1
    `;
    values = [];

    if(filters.name){
        values.push(`%${filters.name}%`);
        query += ` AND i.name ILIKE $${values.length}`;
    }
    
    if(filters.description){
        values.push(`%${filters.description}%`);
        query += ` AND i.description ILIKE $${values.length}`;
    }

    if(filters.status){
        values.push(`${filters.status}%`);
        query += ` AND i.status ILIKE $${values.length}`;
    }

    if(filters.createdAt){
        values.push(`%${filters.createdAt}%`);
        query += ` AND DATE(i.created_at) = DATE($${values.length})`;
    }

    try {
        console.log(query);
        const data = await pool.query(query, values);
        return data.rows;
    } catch (err) {
        console.error(err.message);
    }
}

async function findById(id){
    const query = "SELECT * FROM item WHERE id = $1";
    const values = [id];
    try {
        const data = pool.query(query, values);
        return (await data).rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

async function updateStatus(id, status){
    const query = "UPDATE item SET STATUS = $1 WHERE ID = $2 RETURNING *";
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
