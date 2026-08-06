const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Shoaibs%401203@db.qmlpslmeiunymhnolhmi.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_publication_tables 
          WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
        ) THEN
          ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
        END IF;
      END
      $$;
    `);
    console.log("Success", res);
  } catch (err) {
    console.error("Error", err);
  } finally {
    await client.end();
  }
}
run();
