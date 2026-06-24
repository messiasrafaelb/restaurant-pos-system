const service = require("../services/user-service");
const AppError = require('../errors/app-error');

async function login(req, res, next){
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email)
    console.log(password)

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }
 
    const result = await service.login(email, password);

    return res.status(200).json(result);
  } catch (error) {
    
    if (error.message === 'E-mail ou senha inválidos.') {
        return res.status(401).json({ message: error.message });
    }
    
    next(error); 
  }
}

async function findAll(req, res, next) {
  try {
    const users = await service.findAll();
    return res.render("users-list", { users });
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
    return res.render();
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save, login };