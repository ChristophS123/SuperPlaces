import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zlokqgbzpdeqguyqqnpb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsb2txZ2J6cGRlcWd1eXFxbnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUwNTY3NjQsImV4cCI6MTk4MDYzMjc2NH0.yiJWHUxTX1PYXle-m_7W3w9LK2wHqvbBHPbvHcwfwYY";
export const supabase = createClient(supabaseUrl, String(supabaseKey));
