import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Shoaibs%401203@db.qmlpslmeiunymhnolhmi.supabase.co:5432/postgres';

async function promoteAdmin() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const email = 'shopkareta@gmail.com';
    
    // 1. Confirm email in auth.users so the user can log in
    await client.query(`
      UPDATE auth.users 
      SET email_confirmed_at = NOW(), confirmed_at = NOW() 
      WHERE email = $1
    `, [email]);
    console.log("User email confirmed in auth.users.");

    // 2. Promote to admin in public.profiles
    const res = await client.query(`
      UPDATE public.profiles
      SET role = 'admin'
      WHERE email = $1
      RETURNING id, role
    `, [email]);
    
    if (res.rowCount > 0) {
      console.log("User successfully promoted to admin:", res.rows[0]);
    } else {
      console.log("User not found in public.profiles!");
    }
    
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end();
  }
}

promoteAdmin();
