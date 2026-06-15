class Installment {
    constructor({ id, number, amount, paymentMethodId, saleId, dueDate, status, createdAt }) {
        this.id = id;
        this.number = number;
        this.amount = amount;
        this.paymentMethodId = paymentMethodId;
        this.saleId = saleId;
        this.dueDate = dueDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    static from(obj = {}) {
        return new Installment({
            id: obj.id,
            number: obj.number,
            amount: obj.amount,
            paymentMethodId: obj.paymentMethodId || obj.fk_payment_method || obj.payment_method_id,
            saleId: obj.saleId || obj.fk_sale || obj.sale_id,
            dueDate: obj.dueDate || obj.due_date,
            status: obj.status || 'ATIVO',
            createdAt: obj.createdAt || obj.created_at || new Date()
        });
    }

    static toDbParams(obj) {
        return [
            obj.number,
            obj.amount,
            obj.dueDate,
            obj.saleId,
            obj.paymentMethodId,
            obj.status,
            obj.createdAt
        ];
    }
}

module.exports = {
    Installment
};
