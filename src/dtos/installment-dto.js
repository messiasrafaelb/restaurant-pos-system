function formatDate(value) {
  if (value == null) {
    return null;
  }

  return new Date(value).toISOString();
}

class InstallmentDTO {
  static fromModel(installment) {
    if (!installment) {
      return null;
    }

    return {
      id: installment.id,
      number: installment.number,
      amount: installment.amount,
      saleId: installment.saleId ?? installment.fk_sale,
      paymentMethodId: installment.paymentMethodId ?? installment.fk_payment_method,
      dueDate: formatDate(installment.dueDate ?? installment.due_date),
      status: installment.status,
      createdAt: formatDate(installment.createdAt ?? installment.created_at)
    };
  }

  static toEntity(payload) {
    const saleId = payload.saleId ?? payload.fk_sale;
    const paymentMethodId = payload.paymentMethodId ?? payload.fk_payment_method;
    
    return {
      number: payload.number,
      amount: payload.amount,
      saleId: saleId ? parseInt(saleId, 10) : null,
      paymentMethodId: paymentMethodId ? parseInt(paymentMethodId, 10) : null,
      due_date: payload.dueDate ? new Date(payload.dueDate) : null,
      status: payload.status ?? 'ATIVO',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date()
    };
  }
}

module.exports = InstallmentDTO;
