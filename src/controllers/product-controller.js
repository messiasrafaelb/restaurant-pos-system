const service = require("../services/product-service");
const productFilter = require('../repositories/filters/product-filter');
const AppError = require('../errors/app-error');

async function findAll(req, res, next) {
  try {
    const filters = productFilter.parseQuery(req.query);
    const products = await service.findAll(filters);
    return res.render("products-list", { products, filters });
  } catch (error) {
    return next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const product = await service.findByIdOrThrow(id);
    return res.render("product-detail", { product });
  } catch (error) {
    return next(error);
  }
}

async function save(req, res, next) {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      throw new AppError('Nome e Preço do produto são obrigatórios.', 400);
    }
    await service.save(req.body);
    return res.redirect("/luizao/products");
  } catch (error) {
    return next(error);
  }
}

module.exports = { findAll, findById, save };