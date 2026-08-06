const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No DATABASE_URL found in .env.local');
    return;
  }
  
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    const sql = fs.readFileSync('supabase/migrations/20260806000000_checkout_rpc.sql', 'utf8');
    await client.query(sql);
    console.log('Migration executed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}
run();
