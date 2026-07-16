import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_URL";
const supabaseKey = "YOUR_KEY";

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
