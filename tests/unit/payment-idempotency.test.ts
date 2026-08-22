import { describe, it, expect } from "vitest";
import { PaymentLedgerService } from "@/services/payment/payment-ledger.service";
import { type SupabaseClient } from "@supabase/supabase-js";

describe("PaymentLedgerService (Idempotency & Duplicate Guards)", () => {
  it("should return false when a transaction reference is empty or not found", async () => {
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null }),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const isProcessedEmpty = await PaymentLedgerService.isTransactionProcessed(mockSupabase, "");
    expect(isProcessedEmpty).toBe(false);

    const isProcessedNew = await PaymentLedgerService.isTransactionProcessed(mockSupabase, "TX_NEW_12345");
    expect(isProcessedNew).toBe(false);
  });

  it("should return true when a transaction reference was already marked SUCCESSFUL", async () => {
    const mockSupabase = {
      from: (table: string) => {
        if (table === "user_subscriptions") {
          return {
            select: () => ({
              eq: (_field: string, val: string) => ({
                eq: (_statusField: string, statusVal: string) => ({
                  maybeSingle: async () => {
                    if (val === "CAMPAY_PROCESSED_999" && statusVal === "SUCCESSFUL") {
                      return { data: { campay_reference: val, campay_payment_status: "SUCCESSFUL" } };
                    }
                    return { data: null };
                  },
                }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null }),
              }),
            }),
          }),
        };
      },
    } as unknown as SupabaseClient;

    const isProcessed = await PaymentLedgerService.isTransactionProcessed(
      mockSupabase,
      "CAMPAY_PROCESSED_999"
    );
    expect(isProcessed).toBe(true);
  });
});
