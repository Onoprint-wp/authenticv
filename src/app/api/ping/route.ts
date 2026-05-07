import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Auth
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    results.auth = user ? `ok (${user.email})` : `no session: ${error?.message}`;
  } catch (e) {
    results.auth = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 2. API key presence
  const rawKey = process.env.ANTHROPIC_API_KEY ?? "";
  const key = rawKey.replace(/[\r\n\s]+/g, "");
  results.api_key_set = key.length > 0 ? `yes (${key.length} chars, starts ${key.slice(0, 10)}…)` : "MISSING";

  // 3. Anthropic connectivity
  try {
    const provider = createAnthropic({ apiKey: key });
    const { text } = await generateText({
      model: provider("claude-sonnet-4-6"),
      messages: [{ role: "user", content: "Reply with exactly: ok" }],
      maxOutputTokens: 5,
    });
    results.anthropic = `ok — response: "${text.trim()}"`;
  } catch (e) {
    results.anthropic = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}
