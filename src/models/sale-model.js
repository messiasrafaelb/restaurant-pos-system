class Sale{
    constructor({id, amount, discount, created_at, status, fk_user, fk_order}) {
        this.id = id;
        this.amount = amount;
        this.discount = discount;
        this.created_at = created_at;
        this.status = status;
        this.fk_user = fk_user;
        this.fk_order = fk_order;
    }

    static from(obj = {}) {
        return new Sale({
            id: obj.id,
            amount: obj.amount,
            discount: obj.discount,
            status: obj.status || 'ATIVO',
            created_at: obj.created_at ?? obj.createdAt ?? new Date(),
            fk_order: obj.fk_order ?? obj.fkOrder,
            fk_user: obj.fk_user ?? obj.fkUser
        });
    }

    static toDbParams(sale) {
        return [
            sale.amount,
            sale.discount,
            sale.status,
            sale.created_at,
            sale.fk_order,
            sale.fk_user
        ];
    }
}

module.exports = {Sale};