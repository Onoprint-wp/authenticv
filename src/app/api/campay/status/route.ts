import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { PaymentLedgerService } from "@/services/payment/payment-ledger.service";
import { applyCampayTransaction } from "@/services/payment/campay-processor";
import { getTransactionStatus } from "@/lib/campay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/campay/status?ref={external_reference}
 *
 * Returns the real status of a payment intent (updated by the CamPay / Moov webhook),
 * so the builder only shows "payment confirmed" — and only fires the Meta `Purchase`
 * event — once the operator has actually confirmed the payment.
 * The intent must belong to the logged-in user.
 */
export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref")?.trim() ?? "";
  if (!ref || ref.length > 200) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  let intent = await PaymentLedgerService.getPaymentIntent(admin, ref);
  if (!intent || intent.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── Active reconciliation (collect mode): ask CamPay directly if the webhook hasn't landed yet ──
  const campayRef = (intent.metadata as Record<string, unknown> | null | undefined)?.campay_reference;
  if ((intent.status ?? "pending") === "pending" && typeof campayRef === "string" && campayRef) {
    try {
      const tx = await getTransactionStatus(campayRef);
      if (tx && (tx.status === "SUCCESSFUL" || tx.status === "FAILED")) {
        // The reference was obtained from our own /collect/ call; bind it to this intent.
        await applyCampayTransaction(admin, {
          ...tx,
          reference: tx.reference || campayRef,
          external_reference: ref,
        });
        intent = (await PaymentLedgerService.getPaymentIntent(admin, ref)) ?? intent;
      }
    } catch (err) {
      console.warn("[CamPay Status] Reconciliation check failed:", err);
    }
  }

  return NextResponse.json({
    status: intent.status ?? "pending",
    targetType: intent.target_type,
    amount: intent.amount_xaf,
  });
}
