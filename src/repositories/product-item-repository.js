const pool = require("../config/db");

async function save(itemId, productId, quantity, client) {
  const query = "INSERT INTO PRODUCT_ITEM (quantity, fk_item, fk_product) VALUES ($1, $2, $3) RETURNING *";
  const values = [quantity, itemId, productId];
  const executor = client || pool;
  const data = await executor.query(query, values);
  return data.rows[0] || null;
}

async function deleteByItemId(itemId, client) {
  const query = "DELETE FROM PRODUCT_ITEM WHERE FK_ITEM = $1";
  const executor = client || pool;
  await executor.query(query, [itemId]);
}

async function findByItemId(itemId) {
  const query = "SELECT * FROM PRODUCT_ITEM WHERE FK_ITEM = $1";
  const data = await pool.query(query, [itemId]);
  return data.rows;
}

module.exports = {
  save,
  deleteByItemId,
  findByItemId
};
