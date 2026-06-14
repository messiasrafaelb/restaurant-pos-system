class ItemFilter {
    static parseQuery(query = {}) {
        const filters = {};

        if (query.name) {
            filters.name = query.name;
        }

        if (query.description) {
            filters.description = query.description;
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
        let query = `
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
            WHERE 1=1
        `;

        const values = [];

        if (filters.name) {
            values.push(`%${filters.name}%`);
            query += ` AND I.NAME ILIKE $${values.length}`;
        }

        if (filters.description) {
            values.push(`%${filters.description}%`);
            query += ` AND I.DESCRIPTION ILIKE $${values.length}`;
        }

        if (filters.status) {
            values.push(`${filters.status}%`);
            query += ` AND I.STATUS ILIKE $${values.length}`;
        }

        if (filters.createdAt) {
            values.push(filters.createdAt);
            query += ` AND DATE(I.CREATED_AT) = DATE($${values.length})`;
        }

        return { query, values };
    }
}

module.exports = ItemFilter;
