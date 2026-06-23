const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(sale) {
  if (!sale) return null;

  return {
    id: sale.id,
    amount: sale.amount ? parseFloat(sale.amount) : 0.0,
    fkUser: sale.fk_user ?? sale.fkUser,
  };
}

module.exports = { toResponse };