const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function initDatabase() {
  console.log('--- Initializing Smart-Commute AI Database ---');
  console.log(`Connecting to MySQL host: ${process.env.DB_HOST || 'localhost'}, user: ${process.env.DB_USER || 'root'}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    const schemaPath = path.join(__dirname, 'database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema and seed data...');
    await connection.query(sql);

    console.log('Database smart_commute_ai created and populated successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    console.log('Hint: Check that MySQL is running and verify DB_PASSWORD in backend/.env.');
    process.exit(1);
  }
}

initDatabase();
