const pool = require("../config/db");
const ItemFilter = require("./filters/item-filter");
const { Item } = require("../models/item-model");

async function save(item, client){
    const query = "INSERT INTO ITEM (NAME, DESCRIPTION, PRICE, STATUS, CREATED_AT) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = Item.toDbParams(item);
    const data = await client.query(query, values);
    return data.rows[0];
}

async function findAll(filters = {}){
    const { query, values } = ItemFilter.build(filters);
    const data = await pool.query(query, values);
    return data.rows;
}

async function findById(id){
    const query = `
        SELECT
            I.ID AS ITEM_ID,
            I.NAME AS ITEM_NAME,
            I.DESCRIPTION AS ITEM_DESCRIPTION,
            I.PRICE AS ITEM_PRICE,
            I.STATUS AS ITEM_STATUS,
            I.CREATED_AT AS ITEM_CREATED_AT,
            P.ID AS PRODUCT_ID,
            P.NAME AS PRODUCT_NAME,
            P.STATUS AS PRODUCT_STATUS,
            PI.QUANTITY AS PRODUCT_QUANTITY_USED,
            P.QUANTITY_STOCK AS PRODUCT_QUANTITY
        FROM ITEM I
        LEFT JOIN PRODUCT_ITEM PI ON PI.FK_ITEM = I.ID
        LEFT JOIN PRODUCT P ON P.ID = PI.FK_PRODUCT
        WHERE I.ID = $1
    `;
    const values = [id];
    const data = await pool.query(query, values);
    return data.rows;
}

async function updateStatus(id, status){
    const query = "UPDATE ITEM SET STATUS = $1 WHERE ID = $2 RETURNING *";
    const values = [status, id];
    const data = await pool.query(query, values);
    return data.rows[0];
}

module.exports = {
    save,
    findAll,
    findById,
    updateStatus
}
