const service = require("../services/user-service");
const UserFilter = require('../repositories/filters/user-filter');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email e senha são obrigatórios');
      err.status = 400;
      throw err;
    }
    const response = await service.login(email, password);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

async function findAll(req, res, next) {
  try {
    const filters = UserFilter.parseQuery(req.query);
    const users = await service.findAll(filters);
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const user = await service.findByIdOrThrow(id);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const response = await service.save(req.body);
    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  findAll,
  findById,
  save
};
