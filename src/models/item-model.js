class Item{
    constructor({id, name, description, price, status, created_at}){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.status = status;
        this.created_at = created_at;
    }

    static from(obj = {}) {
        return new Item({
            id: obj.id,
            name: obj.name,
            description: obj.description,
            price: obj.price,
            status: obj.status || 'ATIVO',
            created_at: obj.created_at ?? obj.createdAt ?? new Date()
        });
    }

    static toDbParams(item) {
        return [
            item.name,
            item.description,
            item.price,
            item.status,
            item.created_at
        ];
    }
}

module.exports = {Item};