class SaleFilter {
  static parseQuery(query = {}) {
    const filters = {};
    if (query.status) filters.status = query.status;
    if (query.createdAt) filters.createdAt = query.createdAt;
    if (query.fkUser) filters.fk_user = query.fkUser;
    if (query.fkOrder) filters.fk_order = query.fkOrder;
    return filters;
  }

  static build(filters = {}) {
    let query = 'SELECT * FROM sale WHERE 1=1';
    const values = [];

    if (filters.status) {
      values.push(`%${filters.status}%`);
      query += ` AND status ILIKE $${values.length}`;
    }

    if (filters.createdAt) {
      values.push(filters.createdAt);
      query += ` AND DATE(created_at) = DATE($${values.length})`;
    }

    if (filters.fk_user) {
      values.push(filters.fk_user);
      query += ` AND fk_user = $${values.length}`;
    }

    if (filters.fk_order) {
      values.push(filters.fk_order);
      query += ` AND fk_order = $${values.length}`;
    }

    return { query, values };
  }
}

module.exports = SaleFilter;
