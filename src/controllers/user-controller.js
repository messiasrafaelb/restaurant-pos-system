const service = require("../services/user-service");
const userFilter = require('../repositories/filters/user-filter');
const AppError = require('../errors/app-error');

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

module.exports = { findAll, findById, save };