function parseQuery({ status, fkUser, fkOrder } = {}) {
  const filters = {};
  
  if (fkUser) filters.fkUser = parseInt(fkUser, 10);

  return filters;
}

function build(filters = {}) {
  let query = `SELECT S.* FROM SALE S WHERE 1=1`;
  const values = [];

  if (filters.fkUser) {
    values.push(filters.fkUser);
    query += ` AND S.FK_USER = $${values.length}`;
  }

  return { query, values };
}

module.exports = { parseQuery, build };