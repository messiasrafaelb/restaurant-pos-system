const service = require("../services/user-service");
const userFilter = require('../repositories/filters/user-filter');
const AppError = require('../errors/app-error');

async function login(req, res, next){
  try {
    const { email, password } = req.body;

    // Validação simples de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // Chama o serviço para fazer o login
    const result = await service.login(email, password);

    // Retorna o token e os dados do usuário
    return res.status(200).json(result);
  } catch (error) {
    // Se o erro for de credenciais inválidas, você pode tratar o status aqui
    if (error.message === 'E-mail ou senha inválidos.') {
        return res.status(401).json({ message: error.message });
    }
    
    // Passa para o seu middleware de erro centralizado (error-handler.js)
    next(error); 
  }
}

async function findAll(req, res, next) {
  try {
    const filters = userFilter.parseQuery(req.query);
    const users = await service.findAll(filters);
    return res.render("users-list", { users, filters });
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const user = await service.findByIdOrThrow(id);
    return res.render("user-detail", { user });
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError('Nome, e-mail e senha são obrigatórios.', 400);
    }
    await service.save(req.body);
    return res.redirect("/luizao/users");
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save, login };