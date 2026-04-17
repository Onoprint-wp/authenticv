// read-resumes.cjs — lister les Resume et leur userId associé
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://lkzicntysteggdkowyjl.supabase.co",
  // service role key serait nécessaire pour auth.users
  // on utilise l'anon key — access limité aux tables publiques
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxremljbnR5c3RlZ2dka293eWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjkxODcsImV4cCI6MjA5MTk0NTE4N30.6tn5qnWs0SqB_UAWurrWPl-tKm-dUgr3qKm6BFlOC14"
);

async function main() {
  const { data, error } = await supabase
    .from("Resume")
    .select("id, userId, updatedAt")
    .limit(5);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Resumes:", JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
