const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Shoaibs%401203@db.qmlpslmeiunymhnolhmi.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'out_for_delivery' AFTER 'packed';
    `);
    console.log("Success", res);
  } catch (err) {
    console.error("Error", err);
  } finally {
    await client.end();
  }
}
run();
