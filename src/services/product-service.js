const productRepository = require('../repositories/product-repository');
const { Product } = require('../models/product-model');
const { ProductDTO } = require('../dtos');

const MSG_PRODUCT_NOT_FOUND = "Produto não encontrado"

async function save(request){
    const product = Product.from(request);

    const saved = await productRepository.save(product);
    return ProductDTO.fromModel(saved);
}

async function findAll(filters = {}){
    const products = await productRepository.findAll(filters);
    return products.map(ProductDTO.fromModel);
}

async function findByIdOrThrow(id){
    const data = await productRepository.findById(id);
    if (!data){
        const err = new Error(MSG_PRODUCT_NOT_FOUND);
        err.status = 404;
        throw err;
    }else{
        return ProductDTO.fromModel(data);
    }
}

async function updateStatus(id) {
  const product = await findByIdOrThrow(id);
  const next = product.status.toLowerCase() === 'ativo' ? 'INATIVO' : 'ATIVO';
  const data = await productRepository.updateStatus(id, next);
  return ProductDTO.fromModel(data);
}

async function softDelete(id) {
  await findByIdOrThrow(id);
  const data = await productRepository.updateStatus(id, 'INATIVO');
  return ProductDTO.fromModel(data);
}

async function findByNameOrThrow(name) {
    const data = await productRepository.findByName(name);
    if (!data) {
        const err = new Error(MSG_PRODUCT_NOT_FOUND);
        err.status = 404;
        throw err;
    }
    return ProductDTO.fromModel(data);
}

module.exports = {
  save,
  findAll,
  findByIdOrThrow,
  findByNameOrThrow,
  updateStatus,
  softDelete
};

