import { NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");
  
  try {
    const provider = createAnthropic({ apiKey: sanitizedApiKey });
    const result = streamText({
      model: provider("claude-3-5-sonnet-latest"),
      messages: [{ role: "user", content: "Say 'Hello, test successful!'" }],
    });
    return result.toDataStreamResponse();
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || String(error),
      keyLength: sanitizedApiKey.length,
      keyStart: sanitizedApiKey.substring(0, 10),
      keyEnd: sanitizedApiKey.substring(sanitizedApiKey.length - 5)
    }, { status: 500 });
  }
}
