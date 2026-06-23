const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(order) {
  if (!order) return null;

  return {
    id: order.id,
    code: order.code,
    observations: order.observations,
    orderStatus: order.order_status ?? order.orderStatus,
    createdAt: formatDate(order.created_at ?? order.createdAt)
  };
}

module.exports = { toResponse };