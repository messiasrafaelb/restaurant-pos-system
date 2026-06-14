class PaymentMethod {
    constructor({id, code, name, status, created_at}) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.status = status;
        this.created_at = created_at;
    }

    static from(obj = {}) {
        return new PaymentMethod({
            id: obj.id,
            code: obj.code,
            name: obj.name,
            status: obj.status || 'ATIVO',
            created_at: obj.created_at ?? obj.createdAt ?? new Date()
        });
    }

    static toDbParams(paymentMethod) {
        return [
            paymentMethod.code,
            paymentMethod.name,
            paymentMethod.status,
            paymentMethod.created_at
        ];
    }
}

module.exports = {PaymentMethod};