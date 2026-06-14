class Item{
    constructor({id, name, description, price, status, created_at}){
        this.id = id;
        this.name = name;
        this.description =description;
        this.price = price;
        this.status = status;
        this.created_at = created_at;
    }
}

module.exports = {Item};