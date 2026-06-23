function parseQuery({ code, orderStatus } = {}) {
  const filters = {};

  if (code) filters.code = code;
  if (orderStatus) filters.orderStatus = orderStatus;
  
  return filters;
}

function build(filters = {}) {
  let query = `SELECT O.* FROM ORDERS O WHERE 1=1`;
  const values = [];

  if (filters.code) {
    values.push(filters.code);
    query += ` AND O.CODE = $${values.length}`;
  }

  if (filters.orderStatus) {
    values.push(filters.orderStatus);
    query += ` AND O.ORDER_STATUS = $${values.length}`;
  }

  return { query, values };
}

module.exports = { parseQuery, build };