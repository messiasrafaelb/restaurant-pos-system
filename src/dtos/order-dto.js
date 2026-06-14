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
      order_status: payload.orderStatus ?? payload.status ?? payload.order_status ?? 'OPEN',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date()
    };
  }
}

module.exports = { OrderDTO };