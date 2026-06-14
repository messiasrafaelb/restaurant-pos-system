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
      paymentMethodId: installment.paymentMethodId ?? installment.fk_payment_method,
      dueDate: formatDate(installment.dueDate ?? installment.due_date),
      status: installment.status,
      createdAt: formatDate(installment.createdAt ?? installment.created_at)
    };
  }

  static toEntity(payload) {
    return {
      number: payload.number,
      amount: payload.amount,
      fk_payment_method: payload.paymentMethodId ?? payload.fk_payment_method,
      due_date: payload.dueDate ? new Date(payload.dueDate) : null,
      status: payload.status ?? 'ATIVO',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date()
    };
  }
}

module.exports = InstallmentDTO;
