import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://iinqcanvviiwbtxhqptg.supabase.co', 'sb_publishable_2OAsjqD_OKvdspVo_CXukw_p54-wVL5');

async function check() {
  // Login as seller
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@coirgrow.com', // Replace with the actual seller email if known, or ask user. I will query profiles first to find the seller.
    password: 'password123'
  });
  
  // Actually, I can just query the profiles table using the service role key to see who is a seller, but I don't have the service role key.
  // I will just ask the user for the seller email.
}
check();
