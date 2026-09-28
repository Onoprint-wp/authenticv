import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const operator = searchParams.get("operator");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const admin = createAdminClient();

    let query = admin
      .from("transactions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (country && country !== "ALL") {
      query = query.eq("country_code", country.toUpperCase());
    }

    if (operator && operator !== "ALL") {
      query = query.eq("operator", operator.toUpperCase());
    }

    if (status && status !== "ALL") {
      query = query.eq("status", status.toLowerCase());
    }

    if (search) {
      query = query.or(
        `reference_id.ilike.%${search}%,phone_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`
      );
    }

    query = query.range(offset, offset + limit - 1);

    const { data: dbTransactions, count } = await query;

    const txList = dbTransactions || [];
    const totalVol = txList.reduce((acc: number, t: Record<string, any>) => acc + (t.status === "successful" ? Number(t.amount_xaf || 0) : 0), 0);
    const totalFees = txList.reduce((acc: number, t: Record<string, any>) => acc + (t.status === "successful" ? Number(t.fees_operator || 0) : 0), 0);
    const totalAi = txList.reduce((acc: number, t: Record<string, any>) => acc + (t.status === "successful" ? Number(t.cost_ai_estimated || 0) : 0), 0);

    return NextResponse.json({
      success: true,
      transactions: txList,
      pagination: {
        total: count ?? txList.length,
        page,
        limit,
        pages: Math.ceil((count ?? txList.length) / limit) || 1,
      },
      summary: {
        totalVolumeXaf: totalVol,
        totalFeesXaf: totalFees,
        totalCostAiXaf: totalAi,
        netMarginXaf: totalVol - totalFees - totalAi,
      },
    });
  } catch (err) {
    console.error("[Admin Transactions GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      reference_id,
      amount_xaf,
      country_code = "CM",
      operator = "MTN",
      payment_type = "b2c_single",
      status = "successful",
      phone_number,
      customer_email,
      customer_name,
    } = body;

    if (!reference_id || !amount_xaf) {
      return NextResponse.json(
        { error: "reference_id et amount_xaf sont requis" },
        { status: 400 }
      );
    }

    const fees_operator = Math.round(Number(amount_xaf) * 0.03);
    const cost_ai_estimated = payment_type.includes("pro") ? 100 : 30;

    const admin = createAdminClient();
    const { data: newTx, error } = await admin
      .from("transactions")
      .insert({
        reference_id,
        amount_xaf: Number(amount_xaf),
        currency: "XAF",
        country_code: country_code.toUpperCase(),
        operator: operator.toUpperCase(),
        payment_type,
        status,
        phone_number,
        customer_email,
        customer_name,
        fees_operator,
        cost_ai_estimated,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Record Tx DB Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Transaction enregistrée avec succès",
      transaction: newTx,
    });
  } catch (err) {
    console.error("[Admin Transactions POST Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la transaction" },
      { status: 500 }
    );
  }
}
