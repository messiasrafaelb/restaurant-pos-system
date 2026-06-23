function parseQuery({ status, fkUser, fkOrder } = {}) {
  const filters = {};
  
  if (status) filters.status = status;
  if (fkUser) filters.fkUser = parseInt(fkUser, 10);
  if (fkOrder) filters.fkOrder = parseInt(fkOrder, 10);
  
  return filters;
}

function build(filters = {}) {
  let query = `SELECT S.* FROM SALE S WHERE 1=1`;
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    query += ` AND S.STATUS = $${values.length}`;
  }

  if (filters.fkUser) {
    values.push(filters.fkUser);
    query += ` AND S.FK_USER = $${values.length}`;
  }

  if (filters.fkOrder) {
    values.push(filters.fkOrder);
    query += ` AND S.FK_ORDER = $${values.length}`;
  }

  return { query, values };
}

module.exports = { parseQuery, build };