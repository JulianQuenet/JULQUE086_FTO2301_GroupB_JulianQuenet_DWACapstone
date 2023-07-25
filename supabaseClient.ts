import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gvttekbyrvxvwgyqkglc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dHRla2J5cnZ4dndneXFrZ2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkwMDk2NDEsImV4cCI6MjAwNDU4NTY0MX0.sqCsaSvTuB_DlQltNQ2JvnDJQn0mTY-46j-MNOIHZZE"
);

export default supabase;
