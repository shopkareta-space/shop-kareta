const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const connectionString = 'postgresql://postgres.qmlpslmeiunymhnolhmi:Shoaibs%401203@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    console.log('Running tracking statuses migration...');
    const trackingSql = fs.readFileSync('supabase/migrations/20260806000001_add_tracking_statuses.sql', 'utf8');
    // For ADD VALUE, we can't run inside transaction block sometimes, but pg client does not wrap in transaction unless BEGIN is sent.
    await client.query('ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS \'placed\' BEFORE \'processing\'');
    await client.query('ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS \'packed\' AFTER \'processing\'');
    await client.query('ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT \'placed\'::public.order_status');
    console.log('Tracking statuses migration executed successfully!');
    
    console.log('Running email tables migration...');
    const emailSql = fs.readFileSync('supabase/migrations/20260806000002_setup_email_tables.sql', 'utf8');
    await client.query(emailSql);
    console.log('Email tables migration executed successfully!');
    
    console.log('Running checkout RPC migration...');
    const checkoutSql = fs.readFileSync('supabase/migrations/20260806000000_checkout_rpc.sql', 'utf8');
    await client.query(checkoutSql);
    console.log('Checkout RPC migration executed successfully!');
    
    console.log('All migrations completed!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}
run();
