// import pool from "../../config/db/database";
const pool = require("../../config/db/database");

export const generateStockMovement = async function (quantity, stockId){

    
    const q = 'INSERT INTO stock_movement (type, quantity, created_at, fk_stock) VALUES ($1, $2, $3, $4) RETURNING *';
   
    try{
        const data = await pool.query(q, [quantity > 0 ? "Stock_In": "Stock_Out", quantity, new Date(), stockId]);
        return data.rows[0];

    }catch (e){
        console.log("Failed to connect to the database", e);
        return[];
    }
}
