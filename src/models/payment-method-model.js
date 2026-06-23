function toEntity(obj = {}) {
  return {
    id: obj.id,
    code: obj.code,
    name: obj.name,
  };
}

module.exports = { toEntity };