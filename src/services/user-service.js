const repository = require('../repositories/user-repository');
const userModel = require('../models/user-model');
const userDto = require('../dtos/user-dto');
const AppError = require('../errors/app-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MSG_NOT_FOUND = "Usuário não encontrado.";
const MSG_EMAIL_EXISTS = "Este e-mail já está cadastrado.";

async function login(email, password){
  const user = await repository.findByEmail(email);
  if (!user) {
      throw new Error('E-mail ou senha inválidos.');
  }

  // 2. Compara a senha digitada com a senha criptografada do banco
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      throw new Error('E-mail ou senha inválidos.');
  }

  // 3. Se tudo estiver certo, gera o Token JWT
  // Use uma variável de ambiente (.env) para a sua chave secreta
  const secretKey = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';
  
  const token = jwt.sign(
      { id: user.id, email: user.email }, // Dados que vão dentro do token (Payload)
      secretKey, 
      { expiresIn: '1h' } // Tempo de expiração do token
  );

  // Retorna os dados que o controller precisa
  return {
      user: { id: user.id, name: user.name, email: user.email },
      token
  };
}

async function findByIdOrThrow(id) {
  const item = await repository.findById(id);
  if (!item) {
    throw new AppError(MSG_NOT_FOUND, 404);
  }
  return userDto.toResponse(item);
}

async function save(request) {
  const existing = await repository.findByEmail(request.email);
  
  if (existing) {
    throw new AppError(MSG_EMAIL_EXISTS, 400);
  }

  const salt = await bcrypt.genSalt(10);
  request.password = await bcrypt.hash(request.password, salt);

  const user = userModel.toEntity(request);
  const saved = await repository.save(user);
  return userDto.toResponse(saved);
}

module.exports = { findByIdOrThrow, save, login };