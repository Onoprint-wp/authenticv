// test-existing-accounts.cjs — Teste les comptes existants dans Supabase
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://lkzicntysteggdkowyjl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxremljbnR5c3RlZ2dka293eWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjkxODcsImV4cCI6MjA5MTk0NTE4N30.6tn5qnWs0SqB_UAWurrWPl-tKm-dUgr3qKm6BFlOC14"
);

const accounts = [
  { email: "test@authenticv.com", passwords: ["Test@2025!", "test123", "Password123!", "TestAuth@2025"] },
  { email: "demo@authenticv.com", passwords: ["Demo@2025!", "demo123", "Password123!", "DemoAuth@2025"] },
  { email: "admin@test.com", passwords: ["Admin@2025!", "admin123", "Password123!"] },
];

async function tryLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error && data.user) {
    return { success: true, userId: data.user.id };
  }
  return { success: false, error: error?.message };
}

async function main() {
  for (const account of accounts) {
    console.log(`\n📧 Testing: ${account.email}`);
    for (const pw of account.passwords) {
      const result = await tryLogin(account.email, pw);
      if (result.success) {
        console.log(`  ✅ SUCCESS with password: "${pw}" — User ID: ${result.userId}`);
        break;
      } else {
        console.log(`  ❌ "${pw}" → ${result.error}`);
      }
    }
  }
}

main().catch(console.error);
