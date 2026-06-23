const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(user) {
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

module.exports = { toResponse };