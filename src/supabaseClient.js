import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ccpbskchcoqvrvabzdum.supabase.co";
const supabaseKey = "sb_publishable_Zi7RCxUAe5iAXg5pdYrD2w_6yIeupqj";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
