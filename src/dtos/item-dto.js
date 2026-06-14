const { ProductItemDTO } = require('./product-item-dto');

class ItemDTO {
    constructor(data) {
        this.id = data.item_id;
        this.name = data.item_name;
        this.description = data.item_description;
        this.price = data.item_price;
        this.status = data.item_status;
        this.createdAt = data.item_created_at;
        this.products = [];
    }

    addProduct(productData) {
        if (productData.product_id) {
            this.products.push(new ProductItemDTO(productData));
        }
    }

    static fromRows(rows) {
        const items = new Map();

        for (const row of rows) {
            let item = items.get(row.item_id);

            if (!item) {
                item = new ItemDTO(row);
                items.set(row.item_id, item);
            }

            item.addProduct(row);
        }

        return Array.from(items.values());
    }
}

module.exports = { ItemDTO };
