const pool = require('../config/db');
const { OrderItem } = require('../models/order-item-model');

async function save(orderItem, client) {
  const query = `
    INSERT INTO ORDER_ITEM (QUANTITY, AMOUNT, FK_ORDER, FK_ITEM)
    VALUES ($1, $2, $3, $4) RETURNING *
  `;
  const values = OrderItem.toDbParams(orderItem);
  const executor = client || pool;

  const data = await executor.query(query, values);
  return data.rows[0] ? OrderItem.from(data.rows[0]) : null;
}

async function findByOrderId(orderId) {
  const query = `
    SELECT
      OI.ID AS ORDER_ITEM_ID,
      OI.QUANTITY AS ORDER_ITEM_QUANTITY,
      OI.AMOUNT AS ORDER_ITEM_AMOUNT,
      OI.FK_ORDER AS ORDER_ITEM_FK_ORDER,
      OI.FK_ITEM AS ORDER_ITEM_FK_ITEM,
      I.ID AS ITEM_ID,
      I.NAME AS ITEM_NAME,
      I.DESCRIPTION AS ITEM_DESCRIPTION,
      I.PRICE AS ITEM_PRICE,
      I.STATUS AS ITEM_STATUS,
      I.CREATED_AT AS ITEM_CREATED_AT
    FROM ORDER_ITEM OI
    LEFT JOIN ITEM I ON I.ID = OI.FK_ITEM
    WHERE OI.FK_ORDER = $1
  `;

  const data = await pool.query(query, [orderId]);
  return data.rows;
}

module.exports = {
  save,
  findByOrderId
};