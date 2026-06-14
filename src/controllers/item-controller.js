const itemService = require('../services/item-service');

async function save(req, res){
    try {
        if(req.body.price <= 0){
            throw new Error("Não é permitido cadastrar produtos gratis");
        }
        const response = await itemService.save(req.body);
    
        res.status(201).json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: err.message});
    }
}

async function findById(req, res){
    try {
        const {id} = req.params;
        const response = await itemService.findByIdOrThrow(id);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({message: err.message});
    }
}

async function findAll(req, res){
    try {
        const {name, description, status, createdAt} = req.query;
        const filters = {
            name,
            status,
            createdAt,// createdAt: new Date(createdAt)
            description,
        }
        console.log(filters)
        const response = await itemService.findAll(filters);
    
        res.status(200).json(response);
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({message: err.message});
    }
}

async function updateStatus(req, res){
    try {
        const {id} = req.params;
        const response = await itemService.updateStatus(id);
    
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