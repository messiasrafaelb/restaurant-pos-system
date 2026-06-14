function formatDate(value) {
  if (value == null) {
    return null;
  }

  return new Date(value).toISOString();
}

class ProductDTO {
  static fromModel(product) {
    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      status: product.status,
      minimumStock: product.minimum_stock ?? product.minimumStock,
      quantityStock: product.quantity_stock ?? product.quantityStock,
      createdAt: formatDate(product.created_at ?? product.createdAt)
    };
  }

  static toEntity(payload) {
    return {
      name: payload.name,
      status: payload.status ?? 'ATIVO',
      minimum_stock: payload.minimumStock ?? payload.minimum_stock,
      quantity_stock: payload.quantityStock ?? payload.quantity_stock,
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date()
    };
  }
}

module.exports = ProductDTO;
