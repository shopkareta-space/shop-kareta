import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'shopkareta@gmail.com';
  const password = 'Shoaibs@1234';

  console.log(`Signing up ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Admin User',
      }
    }
  });

  if (error) {
    console.error('Signup error:', error.message);
    if (error.message.includes('already registered')) {
        console.log("Trying to login instead...");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (loginError) {
            console.error("Login failed:", loginError.message);
            return;
        }
        console.log("Logged in successfully. Updating role...");
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', loginData.user.id);
        
        if (updateError) {
            console.error("Update role error:", updateError.message);
        } else {
            console.log("Role updated to admin successfully!");
        }
    }
    return;
  }

  console.log('Signup successful!', data.user?.id);

  // If email confirmation is disabled, we can immediately update the profile
  if (data.session) {
    console.log("User session exists. Updating role to admin...");
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
    
    if (updateError) {
        console.error("Update role error:", updateError.message);
    } else {
        console.log("Role updated to admin successfully!");
    }
  } else {
    console.log("Note: Email confirmation might be required. If so, check your inbox, confirm the email, and then we can update the role.");
  }
}

createAdmin();
