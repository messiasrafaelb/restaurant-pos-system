const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repository = require('../repositories/user-repository');
const { User } = require('../models/user-model');
const { UserDTO } = require('../dtos');
const { JWT_SECRET } = require('../middlewares/auth-middleware');

const MSG_USER_NOT_FOUND = "Usuário não encontrado.";
const SALT_ROUNDS = 10;

async function findAll(filters = {}) {
  const users = await repository.findAll(filters);
  return users.map(UserDTO.fromModel);
}

async function findByIdOrThrow(id) {
  const user = await repository.findById(id);

  if (user == null) {
    const err = new Error(MSG_USER_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  return UserDTO.fromModel(user);
}

async function save(request) {
  const hashedPassword = await bcrypt.hash(request.password, SALT_ROUNDS);
  const user = User.from({ ...request, password: hashedPassword });
  const saved = await repository.save(user);
  return UserDTO.fromModel(saved);
}

async function login(email, password) {
  const user = await repository.findByEmail(email);
  if (!user) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, role: user.role }
  };
}

module.exports = {
  findAll,
  findByIdOrThrow,
  save,
  login
};
