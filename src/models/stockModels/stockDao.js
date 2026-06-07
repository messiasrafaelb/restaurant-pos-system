// import pool from "../../config/db/database";
const pool = require("../../config/db/database");

import { generateStockMovement } from "./stockMovDao";


export const getStock = async function (text){

    if(text){
        const q = 'SELECT * FROM stock INNER JOIN products ON stock.product_id = products.id WHERE products.name ILIKE $1';
    }else{
        const q = 'SELECT * FROM stock INNER JOIN products ON stock.product_id = products.id';
    }

    try{
        const data = await pool.query(q, [`%${text}%`]);
        return data.rows;

    }catch (e){
        console.log("Failed to connect to the database", e);
        return[];
    }
}

export const getStockById = async function (productId){
    const q = 'SELECT * FROM stock INNER JOIN products ON stock.product_id = products.id WHERE stock.product_id = $1';

    try{
        const data = await pool.query(q, [productId]);
        return data.rows;

    }catch (e){
        console.log("Failed to connect to the database", e);
        return[];
    }
}
export const insertStock = async function (productId, quantity = 0){
    const q = 'INSERT INTO stock (product_id, quantity) VALUES ($1, $2) RETURNING *';

    try{
        const data = await pool.query(q, [productId, quantity]);
        const insertedData = data.rows[0];
        await generateStockMovement(quantity, insertedData.id);

    }catch (e){
        console.log("Failed to connect to the database", e);
        return null;
    }
}

export const updateStock = async function (productId, quantity = 0){
    const q = 'UPDATE stock SET quantity = $2 WHERE product_id = $1 RETURNING *';

    try{
        const previous = await getStockById(productId);
        const newQuantity = previous.quantity + quantity;
        const data = await pool.query(q, [productId, newQuantity]);
        const insertedData = data.rows[0];
        await generateStockMovement(quantity, insertedData.id);

    }catch (e){
        console.log("Failed to connect to the database", e);
        return null;
    }
}

export const deleteStock = async function (productId){
    const q = 'DELETE FROM stock WHERE product_id = $1 RETURNING *';

    try{
        const data = await pool.query(q, [productId]);
        const insertedData = data.rows[0];
        await generateStockMovement(-insertedData.quantity, insertedData.id);

    }catch (e){
        console.log("Failed to connect to the database", e);
        return null;
    }
}

