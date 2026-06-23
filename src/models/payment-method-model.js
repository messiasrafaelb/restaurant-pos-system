function toEntity(obj = {}) {
  return {
    id: obj.id,
    code: obj.code,
    name: obj.name,
    status: obj.status || 'ACTIVE',
    createdAt: obj.created_at ?? obj.createdAt ?? new Date()
  };
}

module.exports = { toEntity };