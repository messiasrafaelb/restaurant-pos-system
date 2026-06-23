function toResponse(customer) {
  if (!customer) return null;

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    document: customer.document
  };
}

module.exports = { toResponse };