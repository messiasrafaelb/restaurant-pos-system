class OrderFilter {
  static parseQuery(query = {}) {
    const filters = {};

    if (query.code) {
      filters.code = query.code;
    }

    if (query.orderStatus) {
      filters.status = query.orderStatus;
    }

    if (query.status) {
      filters.status = query.status;
    }

    if (query.createdAt) {
      filters.createdAt = query.createdAt;
    }

    return filters;
  }

  static build(filters = {}) {
    let query = 'SELECT * FROM ORDERS WHERE 1=1';
    const values = [];

    if (filters.code) {
      values.push(`%${filters.code}%`);
      query += ` AND CODE ILIKE $${values.length}`;
    }

    if (filters.status) {
      values.push(`%${filters.status}%`);
      query += ` AND ORDER_STATUS ILIKE $${values.length}`;
    }

    if (filters.createdAt) {
      values.push(filters.createdAt);
      query += ` AND DATE(CREATED_AT) = DATE($${values.length})`;
    }

    return { query, values };
  }
}

module.exports = OrderFilter;
