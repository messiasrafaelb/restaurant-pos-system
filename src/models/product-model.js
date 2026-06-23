function toEntity(obj = {}) {
  return {
    id: obj.id,
    name: obj.name,
    price: obj.price ? parseFloat(obj.price) : 0.0,
    unitMeasure: obj.unit_measure ?? obj.unitMeasure ?? null,
  };
}

function toPoolParams(product) {
  return [
    product.name,
    product.price,
    product.unitMeasure,
  ];
}

module.exports = { toEntity, toPoolParams };