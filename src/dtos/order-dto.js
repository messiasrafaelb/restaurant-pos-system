function formatDate(value) {
  if (value == null) {
    return null;
  }

  return new Date(value).toISOString();
}

class OrderDTO {
  static fromModel(order) {
    if (!order) {
      return null;
    }

    return {
      id: order.id,
      code: order.code,
      observations: order.observations,
      status: order.status,
      createdAt: formatDate(order.created_at ?? order.createdAt)
    };
  }

  static toEntity(payload) {
    return {
      code: payload.code,
      observations: payload.observations ?? null,
      status: payload.orderStatus ?? payload.status ?? payload.order_status ?? 'OPEN',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date(),
      items: (payload.items || []).map(i => ({
        itemId: i.itemId ?? i.fk_item ?? i.item_id,
        quantity: i.quantity,
        amount: i.amount
      }))
    };
  }
}

module.exports = { OrderDTO };
