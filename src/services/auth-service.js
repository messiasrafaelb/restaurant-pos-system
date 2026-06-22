const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repository = require('../repositories/user-repository');
const { bcryptHashPattern } = require('../middlewares/auth-middleware');

const SECRET = process.env.JWT_SECRET || 'supersecret123';
const EXPIRES_IN = '8h';

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  if (bcryptHashPattern.test(stored)) {
    return bcrypt.compare(password, stored);
  }
  return password === stored;
}

async function authenticate(email, password) {
  if (!email || !password) {
    const err = new Error('Email e senha são obrigatórios');
    err.status = 400;
    throw err;
  }

  const user = await repository.findByEmail(email);
  if (!user) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  if (!bcryptHashPattern.test(user.password)) {
    const hashed = await hashPassword(password);
    await repository.updatePassword(user.id, hashed);
    user.password = hashed;
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  return { user: payload, token };
}

module.exports = {
  authenticate
};