function parseQuery({ name, status } = {}) {
    const filters = {};

    if (name) filters.name = name;
    if (status) filters.status = status;
    
    return filters;
}

function build(filters = {}) {
    let query = `SELECT P.* FROM PRODUCT P WHERE 1=1`;
    const values = [];

    if (filters.name) {
        values.push(`%${filters.name}%`);
        query += ` AND P.NAME ILIKE $${values.length}`;
    }

    if (filters.status) {
        values.push(filters.status);
        query += ` AND P.STATUS = $${values.length}`;
    }

    return { query, values };
}

module.exports = { parseQuery, build }; 