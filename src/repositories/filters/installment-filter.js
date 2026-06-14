class InstallmentFilter {
    static parseQuery(query = {}) {
        const filters = {};

        if (query.paymentMethodId !== undefined) {
            const parsed = parseInt(query.paymentMethodId, 10);
            if (!Number.isNaN(parsed)) {
                filters.paymentMethodId = parsed;
            }
        }

        const minAmountSource = query.minAmount ?? query.amountFrom;
        if (minAmountSource !== undefined) {
            const parsed = parseFloat(minAmountSource);
            if (!Number.isNaN(parsed)) {
                filters.minAmount = parsed;
            }
        }

        const maxAmountSource = query.maxAmount ?? query.amountTo;
        if (maxAmountSource !== undefined) {
            const parsed = parseFloat(maxAmountSource);
            if (!Number.isNaN(parsed)) {
                filters.maxAmount = parsed;
            }
        }

        if (query.dueDate) {
            filters.dueDate = query.dueDate;
        }

        if (query.dueDateFrom) {
            filters.dueDateFrom = query.dueDateFrom;
        }

        if (query.dueDateTo) {
            filters.dueDateTo = query.dueDateTo;
        }

        return filters;
    }

    static build(filters = {}) {
        let query = 'SELECT * FROM INSTALLMENT WHERE 1=1';
        const values = [];

        if (filters.paymentMethodId !== undefined) {
            values.push(filters.paymentMethodId);
            query += ` AND FK_PAYMENT_METHOD = $${values.length}`;
        }

        if (filters.minAmount !== undefined && filters.maxAmount !== undefined) {
            values.push(filters.minAmount);
            values.push(filters.maxAmount);
            const maxIndex = values.length;
            const minIndex = maxIndex - 1;
            query += ` AND AMOUNT BETWEEN $${minIndex} AND $${maxIndex}`;
        } else if (filters.minAmount !== undefined) {
            values.push(filters.minAmount);
            query += ` AND AMOUNT >= $${values.length}`;
        } else if (filters.maxAmount !== undefined) {
            values.push(filters.maxAmount);
            query += ` AND AMOUNT <= $${values.length}`;
        }

        if (filters.dueDate) {
            values.push(filters.dueDate);
            query += ` AND DATE(DUE_DATE) = DATE($${values.length})`;
        }

        if (filters.dueDateFrom !== undefined) {
            values.push(filters.dueDateFrom);
            query += ` AND DATE(DUE_DATE) >= DATE($${values.length})`;
        }

        if (filters.dueDateTo !== undefined) {
            values.push(filters.dueDateTo);
            query += ` AND DATE(DUE_DATE) <= DATE($${values.length})`;
        }

        return { query, values };
    }
}

module.exports = InstallmentFilter;
