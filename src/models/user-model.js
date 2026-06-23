function toEntity(obj = {}) {
  return {
    id: obj.id,
    name: obj.name,
    email: obj.email,
    password: obj.password,
    role: obj.role || 'ATTENDANT',
  };
}

function toPoolParams(user) {
  return [
    user.name,
    user.email,
    user.password,
    user.role,
  ];
}

module.exports = { toEntity, toPoolParams };