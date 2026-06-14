const pool = require("../config/db");

async function save(itemId, productId, quantity, client){
    const query = "INSERT INTO PRODUCT_ITEM (quantity, fk_item, fk_product) VALUES ($1, $2, $3)";
    const values = [quantity, itemId, productId];

    try {
        const data = await client.query(query, values);
        return await data.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    save
};