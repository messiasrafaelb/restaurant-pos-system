const { ItemDTO } = require('./item-dto');

class OrderItemDTO {
  constructor(data) {
    this.id = data.order_item_id ?? data.id;
    this.quantity = data.order_item_quantity ?? data.quantity;
    this.amount = data.order_item_amount ?? data.amount;
    this.orderId = data.order_item_fk_order ?? data.fk_order ?? data.orderId;
    this.itemId = data.order_item_fk_item ?? data.fk_item ?? data.itemId;
    this.item = data.item_id ? new ItemDTO(data) : null;
  }

  static fromRows(rows) {
    return rows.map(row => new OrderItemDTO(row));
  }

  static fromModel(orderItem) {
    if (!orderItem) {
      return null;
    }

    return new OrderItemDTO({
      id: orderItem.id,
      quantity: orderItem.quantity,
      amount: orderItem.amount,
      fk_order: orderItem.fk_order,
      fk_item: orderItem.fk_item
    });
  }

  static toEntity(payload) {
    return {
      quantity: payload.quantity,
      amount: payload.amount ?? null,
      fk_order: payload.orderId ?? payload.fk_order,
      fk_item: payload.itemId ?? payload.fk_item
    };
  }
}

module.exports = { OrderItemDTO };