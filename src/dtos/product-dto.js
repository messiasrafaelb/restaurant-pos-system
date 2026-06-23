const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    price: product.price ? parseFloat(product.price) : 0.0,
    unitMeasure: product.unit_measure ?? product.unitMeasure,
    status: product.status,
    createdAt: formatDate(product.created_at ?? product.createdAt)
  };
}

module.exports = { toResponse };