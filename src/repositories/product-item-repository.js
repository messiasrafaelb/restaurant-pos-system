const pool = require("../config/db");

async function save(itemId, productId, quantity, client){
    const query = "INSERT INTO PRODUCT_ITEM (quantity, fk_item, fk_product) VALUES ($1, $2, $3) RETURNING *";
    const values = [quantity, itemId, productId];
    const data = await client.query(query, values);
    return data.rows[0] || null;
}

module.exports = {
    save
};