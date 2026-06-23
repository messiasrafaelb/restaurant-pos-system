function toEntity(obj = {}) {
  return {
    id: obj.id,
    amount: obj.amount ? parseFloat(obj.amount) : 0.0,
    discount: obj.discount ? parseFloat(obj.discount) : 0.0,
    status: obj.status || 'ACTIVE',
    fkOrder: obj.fk_order ?? obj.fkOrder,
    fkUser: obj.fk_user ?? obj.fkUser,
    fkPaymentMethod: obj.fk_payment_method ?? obj.fkPaymentMethod,
    createdAt: obj.created_at ?? obj.createdAt ?? new Date()
  };
}

function toPoolParams(sale) {
  return [
    sale.amount,
    sale.discount,
    sale.status,
    sale.fkOrder,
    sale.fkUser,
    sale.fkPaymentMethod
  ];
}

module.exports = { toEntity, toPoolParams };