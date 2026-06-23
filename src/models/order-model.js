function toEntity(obj = {}) {
  return {
    id: obj.id,
    code: obj.code,
    observations: obj.observations || null,
    orderStatus: obj.order_status ?? obj.orderStatus ?? 'PENDING',
    createdAt: obj.created_at ?? obj.createdAt ?? new Date()
  };
}

function toPoolParams(order) {
  return [
    order.code,
    order.observations,
    order.orderStatus
  ];
}

module.exports = { toEntity, toPoolParams };