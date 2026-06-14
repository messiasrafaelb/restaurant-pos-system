class OrderItem {
  constructor({ id, quantity, amount, fk_order, fk_item }) {
    this.id = id;
    this.quantity = quantity;
    this.amount = amount;
    this.fk_order = fk_order;
    this.fk_item = fk_item;
  }

  static from(obj = {}) {
    return new OrderItem({
      id: obj.id,
      quantity: obj.quantity,
      amount: obj.amount,
      fk_order: obj.fk_order ?? obj.orderId ?? obj.order_id,
      fk_item: obj.fk_item ?? obj.itemId ?? obj.item_id
    });
  }

  static toDbParams(orderItem) {
    return [
      orderItem.quantity,
      orderItem.amount,
      orderItem.fk_order,
      orderItem.fk_item
    ];
  }
}

module.exports = { OrderItem };