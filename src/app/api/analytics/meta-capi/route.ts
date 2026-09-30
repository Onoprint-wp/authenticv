import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1393602539516255";
const META_CAPI_TOKEN = process.env.META_CONVERSIONS_API_TOKEN || process.env.META_ACCESS_TOKEN;

function hashSha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface CapiRequestBody {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userEmail?: string;
  userPhone?: string;
  clientIp?: string;
  clientUserAgent?: string;
  customData?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CapiRequestBody;
    const { eventName, eventId, eventSourceUrl, userEmail, userPhone, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    // If Meta CAPI Token is not configured, silently skip without error (Pixel continues in browser)
    if (!META_CAPI_TOKEN) {
      return NextResponse.json({ ok: true, mode: "browser_only", message: "META_CONVERSIONS_API_TOKEN not set" });
    }

    // Extract headers for IP & User Agent
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || body.clientIp;
    const clientUserAgent = request.headers.get("user-agent") || body.clientUserAgent;

    const userData: Record<string, unknown> = {
      client_user_agent: clientUserAgent,
    };

    if (clientIp) {
      userData.client_ip_address = clientIp;
    }

    if (userEmail) {
      userData.em = [hashSha256(userEmail)];
    }

    if (userPhone) {
      // Clean phone number to international format without spaces/plus before hash
      const cleanPhone = userPhone.replace(/[^0-9]/g, "");
      userData.ph = [hashSha256(cleanPhone)];
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || crypto.randomUUID(),
          event_source_url: eventSourceUrl || "https://www.authenticv.app",
          action_source: "website",
          user_data: userData,
          custom_data: customData || {},
        },
      ],
    };

    const graphUrl = `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;

    const res = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.warn("[Meta CAPI] Graph API response error:", result);
      return NextResponse.json({ ok: false, error: result }, { status: 200 });
    }

    return NextResponse.json({ ok: true, events_received: result.events_received });
  } catch (err) {
    console.warn("[Meta CAPI] Handler error:", err);
    return NextResponse.json({ ok: false, error: "Internal CAPI error" }, { status: 200 });
  }
}
