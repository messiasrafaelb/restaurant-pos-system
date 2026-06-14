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

        const item = new Item({
            name: request.name,
            description: request.description,
            price: request.price,
            status: 'ATIVO',
            created_at: new Date()
        });
        
        const itemResult = await itemRepository.save(item, client);
        
        const products = request.products || [];

        for (const product of products) {
            const { quantity, productId } = product;
            await productItemRepository.save(itemResult.id, productId, quantity, client);
        }
    
        await client.query('COMMIT');
        return itemResult

    }catch(err){
        await client.query('ROLLBACK');
        console.log(err.message)
    }finally{
        client.release();
    }
}

async function findAll(filters = {}){
    const rows = await itemRepository.findAll(filters);
    return ItemDTO.fromRows(rows);
}

async function findByIdOrThrow(id){
    const data = await itemRepository.findById(id);
    if (!data){
        throw new Error(MSG_ITEM_NOT_FOUND);
    }else{
        return data;
    }
}

async function updateStatus(id){
    const item = await findByIdOrThrow(id);
    const data = await itemRepository.updateStatus(id, item.status.toLowerCase() == "ativo" ? "INATIVO" : "ATIVO");
    return data;
}


module.exports = {
    save,
    findAll,
    findByIdOrThrow,
    updateStatus
}
