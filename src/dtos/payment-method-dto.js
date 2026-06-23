const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(paymentMethod) {
  if (!paymentMethod) return null;

  return {
    id: paymentMethod.id,
    code: paymentMethod.code,
    name: paymentMethod.name,
    status: paymentMethod.status,
    createdAt: formatDate(paymentMethod.created_at ?? paymentMethod.createdAt)
  };
}

module.exports = { toResponse };