function formatDate(value) {
  if (value == null) return null;
  return new Date(value).toISOString();
}

class SaleDTO {
  static fromModel(sale) {
    if (!sale) return null;

    return {
      id: sale.id,
      amount: sale.amount,
      discount: sale.discount,
      status: sale.status,
      fkOrder: sale.fk_order ?? sale.fkOrder,
      fkUser: sale.fk_user ?? sale.fkUser,
      createdAt: formatDate(sale.created_at ?? sale.createdAt)
    };
  }

  static toEntity(payload = {}) {
    return {
      amount: payload.amount,
      discount: payload.discount ?? 0,
      status: payload.status ?? 'ATIVO',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date(),
      fk_order: payload.fkOrder ?? payload.fk_order ?? null,
      fk_user: payload.fkUser ?? payload.fk_user ?? null
    };
  }
}

module.exports = { SaleDTO };