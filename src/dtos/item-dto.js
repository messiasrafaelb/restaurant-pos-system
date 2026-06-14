const { ProductItemDTO } = require('./product-item-dto');

class ItemDTO {
    constructor(data) {
        this.id = data.item_id ?? data.id;
        this.name = data.item_name ?? data.name;
        this.description = data.item_description ?? data.description;
        this.price = data.item_price ?? data.price;
        this.status = data.item_status ?? data.status;
        this.createdAt = data.item_created_at ?? data.created_at ?? data.createdAt;
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

    static fromModel(item) {
        if (!item) {
            return null;
        }

        return new ItemDTO({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            status: item.status,
            created_at: item.created_at
        });
    }
}

module.exports = { ItemDTO };