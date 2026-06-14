const productService = require('../services/product-service');
const ProductFilter = require('../repositories/filters/product-filter');
const { ProductDTO } = require('../dtos');

async function save(req, res, next){
    try {
        if (!req.body || !req.body.name) {
            const err = new Error('Nome do produto é obrigatório');
            err.status = 400;
            throw err;
        }

        const entity = ProductDTO.toEntity(req.body);
        const response = await productService.save(entity);

        res.status(201).json(response);
    } catch (err) {
        console.error(err.message);
        return next(err);
    }
}

async function findById(req, res, next){
    try {
        const {id} = req.params;
        const response = await productService.findByIdOrThrow(id);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        return next(err);
    }
}

async function findAll(req, res, next){
    try {
        const filters = ProductFilter.parseQuery(req.query);
        const response = await productService.findAll(filters);

        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        return next(err);
    }
}

async function updateStatus(req, res, next){
    try {
        const {id} = req.params;
        const response = await productService.updateStatus(id);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        return next(err);
    }
}
module.exports = {
    save,
    findAll,
    findById,
    updateStatus
}