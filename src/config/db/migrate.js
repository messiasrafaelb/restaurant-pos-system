// src/db/migrate.js
const fs = require('fs');
const path = require('path');
const pool = require('./connection');

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

async function getExecutedMigrations() {
  const res = await pool.query('SELECT name FROM migrations');
  return res.rows.map(r => r.name);
}

async function run() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const executed = await getExecutedMigrations();

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (executed.includes(file)) continue;

      console.log('Rodando:', file);

      const sql = fs.readFileSync(
        path.join(MIGRATIONS_DIR, file),
        'utf-8'
      );

      await client.query(sql);

      await client.query(
        'INSERT INTO migrations(name) VALUES ($1)',
        [file]
      );
    }

    await client.query('COMMIT');

    console.log('Migrations OK');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

run();