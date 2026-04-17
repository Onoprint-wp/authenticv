// create-test-user.cjs — Crée un compte test Supabase via signUp
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://lkzicntysteggdkowyjl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxremljbnR5c3RlZ2dka293eWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjkxODcsImV4cCI6MjA5MTk0NTE4N30.6tn5qnWs0SqB_UAWurrWPl-tKm-dUgr3qKm6BFlOC14"
);

const EMAIL = "authenticv.playwright.test@gmail.com";
const PASSWORD = "PlaywrightTest@2026!";

async function main() {
  console.log(`📧 Creating test user: ${EMAIL}`);

  // Try signUp
  const { data, error } = await supabase.auth.signUp({
    email: EMAIL,
    password: PASSWORD,
  });

  if (error) {
    console.error("❌ signUp error:", error.message);

    // Maybe user already exists — try signIn to confirm
    const { data: d2, error: e2 } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD,
    });
    if (e2) {
      console.error("❌ signIn also failed:", e2.message);
    } else {
      console.log("✅ User already exists and can sign in:", d2.user?.email);
    }
    return;
  }

  if (data.user) {
    console.log("✅ User created:", data.user.email);
    console.log("⚠️  Check if email confirmation is required in Supabase settings");
    console.log("   User ID:", data.user.id);
    console.log("   Email confirmed:", data.user.email_confirmed_at ? "YES" : "NO (confirmation required)");
  }

  // Now try to sign in immediately
  const { data: d3, error: e3 } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });

  if (e3) {
    console.log("⚠️  Can't sign in yet:", e3.message);
    console.log("   → Go to Supabase dashboard and disable email confirmation, or confirm the email manually");
  } else {
    console.log("✅ Can sign in successfully! User ID:", d3.user?.id);
  }
}

main().catch(console.error);
