function formatDate(value) {
  if (value == null) return null;
  return new Date(value).toISOString();
}

class UserDTO {
  static fromModel(user) {
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: formatDate(user.created_at ?? user.createdAt)
    };
  }

  static toEntity(payload) {
    return {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role ?? 'USER',
      status: payload.status ?? 'ATIVO',
      created_at: payload.createdAt ? new Date(payload.createdAt) : new Date()
    };
  }
}

module.exports = { UserDTO };
