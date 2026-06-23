const formatDate = (value) => value ? new Date(value).toISOString() : null;

function toResponse(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

module.exports = { toResponse };