function toEntity(obj = {}) {
  return {
    id: obj.id,
    name: obj.name,
    phone: obj.phone || null,
    document: obj.document || null
  };
}

function toPoolParams(customer) {
  return [
    customer.name,
    customer.phone,
    customer.document
  ];
}

module.exports = { toEntity, toPoolParams };