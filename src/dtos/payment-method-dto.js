function formatDate(value) {
  if (value == null) {
    return null;
  }

  return new Date(value).toISOString();
}

class PaymentMethodDTO {
  static fromModel(paymentMethod) {
    if (!paymentMethod) {
      return null;
    }

    return {
      id: paymentMethod.id,
      code: paymentMethod.code,
      name: paymentMethod.name,
      status: paymentMethod.status,
      createdAt: formatDate(paymentMethod.created_at ?? paymentMethod.createdAt)
    };
  }
}

module.exports = PaymentMethodDTO;
