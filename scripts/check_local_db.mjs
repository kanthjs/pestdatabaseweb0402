import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

async function check() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log("Database URL:", process.env.DATABASE_URL);
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in public schema:", res.rows.map(r => r.table_name));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
