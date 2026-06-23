function toEntity(obj = {}) {
  return {
    id: obj.id,
    name: obj.name,
    price: obj.price ? parseFloat(obj.price) : 0.0,
    unitMeasure: obj.unit_measure ?? obj.unitMeasure ?? null,
    status: obj.status || 'ACTIVE',
    createdAt: obj.created_at ?? obj.createdAt ?? new Date()
  };
}

function toPoolParams(product) {
  return [
    product.name,
    product.price,
    product.unitMeasure,
    product.status
  ];
}

module.exports = { toEntity, toPoolParams };