class ProductItemDTO {
    constructor(data) {
        this.id = data.product_id;
        this.name = data.product_name;
        this.status = data.product_status;
        this.usedQuantity = data.product_quantity_used;
        this.Quantity = data.product_quantity;
    }
}

module.exports = { ProductItemDTO };
