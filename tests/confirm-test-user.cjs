// confirm-test-user.cjs — Confirme l'email du compte test via Admin API (service_role)
const { createClient } = require("@supabase/supabase-js");

const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhc2FzZSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3NDQ5MDM0MzcsImV4cCI6MjA2MDQ3OTQzN30.VA353_YfIf0UBhZkqOCR9VHr-xZhDC29c2Fni6RVYB5A";

const supabaseAdmin = createClient(
  "https://lkzicntysteggdkowyjl.supabase.co",
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const TEST_USER_ID = "866c6d89-6906-486a-b4ff-ca3da451d13e"; // authenticv.playwright.test@gmail.com

async function main() {
  console.log("🔧 Confirming email for test user...");

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    TEST_USER_ID,
    {
      email_confirm: true,
    }
  );

  if (error) {
    console.error("❌ Error confirming user:", error.message);
    return;
  }

  console.log("✅ User email confirmed!");
  console.log("   Email:", data.user.email);
  console.log(
    "   email_confirmed_at:",
    data.user.email_confirmed_at ? "✅ confirmed" : "❌ not confirmed"
  );

  // Now verify sign-in works with anon key
  const supabaseAnon = createClient(
    "https://lkzicntysteggdkowyjl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxremljbnR5c3RlZ2dka293eWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjkxODcsImV4cCI6MjA5MTk0NTE4N30.6tn5qnWs0SqB_UAWurrWPl-tKm-dUgr3qKm6BFlOC14"
  );

  const { data: d2, error: e2 } = await supabaseAnon.auth.signInWithPassword({
    email: "authenticv.playwright.test@gmail.com",
    password: "PlaywrightTest@2026!",
  });

  if (e2) {
    console.error("❌ signIn still failing:", e2.message);
  } else {
    console.log(
      "✅ signIn successful! Session obtained. User ID:",
      d2.user?.id
    );
    console.log(
      "=> Update .env.test with:\n   TEST_USER_EMAIL=authenticv.playwright.test@gmail.com\n   TEST_USER_PASSWORD=PlaywrightTest@2026!"
    );
  }
}

main().catch(console.error);
