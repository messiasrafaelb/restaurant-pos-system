class ProductFilter {
    static parseQuery(query = {}) {
        const filters = {};

        if (query.name) {
            filters.name = query.name;
        }

        if (query.status) {
            filters.status = query.status;
        }

        if (query.createdAt) {
            filters.createdAt = query.createdAt;
        }

        if (query.minimum !== undefined) {
            const value = String(query.minimum).toLowerCase();
            filters.minimum = value === 'true' || value === '1' || value === 'yes';
        }

        return filters;
    }

    static build(filters = {}) {
        let query = 'SELECT * FROM PRODUCT WHERE 1=1';
        const values = [];

        if (filters.name) {
            values.push(`%${filters.name}%`);
            query += ` AND name ILIKE $${values.length}`;
        }

        if (filters.status) {
            values.push(`${filters.status}%`);
            query += ` AND status ILIKE $${values.length}`;
        }

        if (filters.createdAt) {
            values.push(filters.createdAt);
            query += ` AND DATE(created_at) = DATE($${values.length})`;
        }

        if (filters.minimum) {
            query += ` AND quantity_stock <= minimum_stock`;
        }

        return { query, values };
    }
}

module.exports = ProductFilter;
