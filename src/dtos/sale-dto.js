const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(sale) {
  if (!sale) return null;

  return {
    id: sale.id,
    amount: sale.amount ? parseFloat(sale.amount) : 0.0,
    discount: sale.discount ? parseFloat(sale.discount) : 0.0,
    status: sale.status,
    fkOrder: sale.fk_order ?? sale.fkOrder,
    fkUser: sale.fk_user ?? sale.fkUser,
    createdAt: formatDate(sale.created_at ?? sale.createdAt)
  };
}

module.exports = { toResponse };