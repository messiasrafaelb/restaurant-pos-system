class PaymentMethodFilter {
    static parseQuery(query = {}) {
        const filters = {};

        if (query.status) {
            filters.status = query.status;
        }

        return filters;
    }

    static build(filters = {}) {
        let query = `SELECT * FROM PAYMENT_METHOD WHERE 1=1`;
        const values = [];

        if (filters.status) {
            values.push(filters.status);
            query += ` AND STATUS = $${values.length}`;
        }

        return { query, values };
    }
}

module.exports = PaymentMethodFilter;
