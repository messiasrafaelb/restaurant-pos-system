class Order {
  constructor({ id, code, observations, status, created_at }) {
    this.id = id;
    this.code = code;
    this.observations = observations;
    this.status = status;
    this.created_at = created_at;
  }

  static from(obj = {}) {
    return new Order({
      id: obj.id,
      code: obj.code,
      observations: obj.observations ?? null,
      status: obj.status ?? obj.order_status ?? 'OPEN',
      created_at: obj.created_at ?? obj.createdAt ?? new Date()
    });
  }

  static toDbParams(order) {
    return [
      order.code,
      order.observations,
      order.status,
      order.created_at
    ];
  }
}

module.exports = {
  Order
};