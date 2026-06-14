const productRepository = require('../repositories/product-repository');
const {Product} = require('../models/product-model');

const MSG_PRODUCT_NOT_FOUND = "Produto não encontrado"

async function save(request){
    const product = new Product({
            name: request.name,
            status: 'ATIVO',
            minimum_stock: request.minimumStock,
            quantity_stock: request.quantityStock,
            created_at: new Date()
        });

    return await productRepository.save(product);
}

async function findAll(filters = {}){
    return await productRepository.findAll(filters);
}

async function findByIdOrThrow(id){
    const data = await productRepository.findById(id);
    if (!data){
        throw new Error(MSG_PRODUCT_NOT_FOUND);
    }else{
        return data;
    }
}

async function updateStatus(id){
    const product = await findByIdOrThrow(id);
    const data = await productRepository.updateStatus(id, product.status.toLowerCase() == "ativo" ? "INATIVO" : "ATIVO");
    return data;
}


module.exports = {
    save,
    findAll,
    findByIdOrThrow,
    updateStatus
}

