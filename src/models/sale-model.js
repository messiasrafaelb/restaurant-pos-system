function toEntity(obj = {}) {
  return {
    id: obj.id,
    amount: obj.amount ? parseFloat(obj.amount) : 0.0,
    fkUser: obj.fk_user ?? obj.fkUser,
    fkPaymentMethod: obj.fk_payment_method ?? obj.fkPaymentMethod,
  };
}

function toPoolParams(sale) {
  return [
    sale.amount,
    sale.fkUser,
    sale.fkPaymentMethod
  ];
}

module.exports = { toEntity, toPoolParams };