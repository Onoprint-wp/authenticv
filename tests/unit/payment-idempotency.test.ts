import { describe, it, expect } from "vitest";
import { PaymentLedgerService } from "@/services/payment/payment-ledger.service";

describe("PaymentLedgerService (Idempotency & Duplicate Guards)", () => {
  it("should return false when a transaction reference is empty or not found", async () => {
    const mockSupabase: any = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null }),
            }),
          }),
        }),
      }),
    };

    const isProcessedEmpty = await PaymentLedgerService.isTransactionProcessed(mockSupabase, "");
    expect(isProcessedEmpty).toBe(false);

    const isProcessedNew = await PaymentLedgerService.isTransactionProcessed(mockSupabase, "TX_NEW_12345");
    expect(isProcessedNew).toBe(false);
  });

  it("should return true when a transaction reference was already marked SUCCESSFUL", async () => {
    const mockSupabase: any = {
      from: (table: string) => {
        if (table === "user_subscriptions") {
          return {
            select: () => ({
              eq: (field: string, val: string) => ({
                eq: (statusField: string, statusVal: string) => ({
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
    };

    const isProcessed = await PaymentLedgerService.isTransactionProcessed(
      mockSupabase,
      "CAMPAY_PROCESSED_999"
    );
    expect(isProcessed).toBe(true);
  });
});
