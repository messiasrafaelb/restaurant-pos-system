class Product{
    constructor({id, name, status, minimum_stock, quantity_stock, created_at}){
        this.id = id;
        this.name = name;
        this.status = status;
        this.minimum_stock = minimum_stock;
        this.quantity_stock = quantity_stock;
        this.created_at = created_at;
    }

    static from(obj = {}){
        return new Product({
            id: obj.id,
            name: obj.name,
            status: obj.status || 'ATIVO',
            minimum_stock: obj.minimum_stock ?? obj.minimumStock,
            quantity_stock: obj.quantity_stock ?? obj.quantityStock,
            created_at: obj.created_at ?? obj.createdAt ?? new Date()
        });
    }

    static toDbParams(product){
        return [
            product.name,
            product.status,
            product.minimum_stock,
            product.quantity_stock,
            product.created_at
        ];
    }
}

module.exports = {Product};