class Product{
    constructor({id, name, status, minimum_stock, quantity_stock, created_at}){
        this.id = id;
        this.name = name;
        this.status = status;
        this.minimum_stock = minimum_stock;
        this.quantity_stock = quantity_stock;
        this.created_at = created_at;
    }
}

module.exports = {Product};