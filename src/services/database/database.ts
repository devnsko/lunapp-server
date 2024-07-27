import { Pool } from 'pg';
import { creatPhotoOfDayTable, creatNeoTable } from './schemas';

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'), 
});

async function connect(): Promise<boolean> {
    try {
        await pool.connect();
        await creatPhotoOfDayTable();
        await creatNeoTable();
        console.log('🌌 [Database] Connected to the database');
        return true;
    } catch (error) {
        console.error('📡 [Database] Error connecting to the database:', error);
        return false;
    }
}

// Function to execute a query
async function query(text: string, params: any[] = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } catch (error) {
        console.error('!📡 [Database] Error executing query:', error);
        throw error;
    } finally {
        client.release();
    }
}
 
export {query as dbQuery, connect as dbConnect};