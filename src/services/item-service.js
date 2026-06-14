const pool = require('../config/db');
const itemRepository = require('../repositories/item-repository');
const productItemRepository = require('../repositories/product-item-repository');
const {Item} = require('../models/item-model');
const { ItemDTO } = require('../dtos/item-dto');

const MSG_ITEM_NOT_FOUND = "Item não encontrado"

async function save(request){
    const client = await pool.connect(); 
    
    try{
        await client.query('BEGIN');

        const item = Item.from(request);
        
        const itemResult = await itemRepository.save(item, client);
        
        const products = request.products || [];

        for (const product of products) {
            const { quantity, productId } = product;
            await productItemRepository.save(itemResult.id, productId, quantity, client);
        }
    
        await client.query('COMMIT');
        return ItemDTO.fromModel(itemResult);

    }catch(err){
        await client.query('ROLLBACK');
        console.log(err.message);
        throw err;
    }finally{
        client.release();
    }
}

async function findAll(filters = {}){
    const rows = await itemRepository.findAll(filters);
    return ItemDTO.fromRows(rows);
}

async function findByIdOrThrow(id){
    const rows = await itemRepository.findById(id);
    if (!rows || rows.length === 0){
        const err = new Error(MSG_ITEM_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    return ItemDTO.fromRows(rows)[0];
}

async function updateStatus(id){
    const item = await itemRepository.findById(id);
    if (!item){
        const err = new Error(MSG_ITEM_NOT_FOUND);
        err.status = 404;
        throw err;
    }

    const nextStatus = item.status.toLowerCase() === 'ativo' ? 'INATIVO' : 'ATIVO';
    const data = await itemRepository.updateStatus(id, nextStatus);
    return ItemDTO.fromModel(data);
}


module.exports = {
    save,
    findAll,
    findByIdOrThrow,
    updateStatus
}
