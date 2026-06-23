function toEntity(obj = {}) {
  return {
    id: obj.id,
    name: obj.name,
    email: obj.email,
    password: obj.password,
    role: obj.role || 'ATTENDANT',
    status: obj.status || 'ACTIVE',
    createdAt: obj.created_at ?? obj.createdAt ?? new Date()
  };
}

function toPoolParams(user) {
  return [
    user.name,
    user.email,
    user.password,
    user.role,
    user.status
  ];
}

module.exports = { toEntity, toPoolParams };