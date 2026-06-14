const productService = require('../services/product-service');
const product = require('../models/product-model');

async function save(req, res){
    try {
        const response = await productService.save(req.body);
    
        res.status(201).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: err.message});
    }
}

async function findById(req, res){
    try {
        const {id} = req.params;
        const response = await productService.findByIdOrThrow(id);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({message: err.message});
    }
}

async function findAll(req, res){
    try {
        const {name, status, createdAt} = req.query;
        const filters = {
            name,
            status,
            createdAt// createdAt: new Date(createdAt)
        }
        console.log(filters)
        const response = await productService.findAll(filters);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({message: err.message});
    }
}

async function updateStatus(req, res){
    try {
        const {id} = req.params;
        const response = await productService.updateStatus(id);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({message: err.message});
    }
}
module.exports = {
    save,
    findAll,
    findById,
    updateStatus
}