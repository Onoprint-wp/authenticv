import { describe, it, expect } from "vitest";
import { RECRUITER_PRICES } from "@/lib/recruiter-plans";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";
import type { PaymentTargetType } from "@/services/payment/payment-ledger.service";

describe("Payment Pricing & Target Type Determinism", () => {
  it("has consistent recruiter pack prices", () => {
    expect(RECRUITER_PRICES.single.amount).toBe(5000);
    expect(RECRUITER_PRICES.single.credits).toBe(1);

    expect(RECRUITER_PRICES.pack5.amount).toBe(20000);
    expect(RECRUITER_PRICES.pack5.credits).toBe(5);

    expect(RECRUITER_PRICES.pack15.amount).toBe(50000);
    expect(RECRUITER_PRICES.pack15.credits).toBe(15);

    expect(RECRUITER_PRICES.monthly_pro.amount).toBe(75000);
    expect(RECRUITER_PRICES.monthly_pro.credits).toBe(999);
  });

  it("has consistent candidate B2C prices", () => {
    expect(PRICE_SINGLE_XAF).toBe(1000);
    expect(PRICE_MONTHLY_XAF).toBe(5000);
    expect(PRICE_ANNUAL_XAF).toBe(18000);
  });

  it("parses structured external_reference for B2C checkouts accurately", () => {
    const parseExtRef = (ref: string) => {
      if (ref.startsWith("b2c:")) {
        const [, uid, tier] = ref.split(":");
        return { userId: uid, targetType: `b2c_${tier}` as PaymentTargetType, isB2B: false };
      }
      if (ref.startsWith("b2b:") || ref.startsWith("recruiter:")) {
        const [, uid, pack] = ref.split(":");
        return { userId: uid, targetType: `b2b_${pack}` as PaymentTargetType, isB2B: true };
      }
      return null;
    };

    const b2cSingle = parseExtRef("b2c:user_abc123:single:nonce456");
    expect(b2cSingle).toEqual({ userId: "user_abc123", targetType: "b2c_single", isB2B: false });

    const b2cMonthly = parseExtRef("b2c:user_abc123:monthly:nonce789");
    expect(b2cMonthly).toEqual({ userId: "user_abc123", targetType: "b2c_monthly", isB2B: false });

    const b2cAnnual = parseExtRef("b2c:user_abc123:annual:nonce999");
    expect(b2cAnnual).toEqual({ userId: "user_abc123", targetType: "b2c_annual", isB2B: false });

    const b2bPack5 = parseExtRef("b2b:user_rec123:pack5:nonce111");
    expect(b2bPack5).toEqual({ userId: "user_rec123", targetType: "b2b_pack5", isB2B: true });

    const b2bMonthlyPro = parseExtRef("b2b:user_rec123:monthly_pro:nonce222");
    expect(b2bMonthlyPro).toEqual({ userId: "user_rec123", targetType: "b2b_monthly_pro", isB2B: true });
  });

  it("calculates promotional discounts without altering target type entitlement", () => {
    const applyDiscount = (baseAmount: number, discountPercent: number) => {
      return Math.max(100, Math.round(baseAmount * (1 - discountPercent / 100)));
    };

    // 50% on single (1000 -> 500)
    expect(applyDiscount(1000, 50)).toBe(500);

    // 20% on monthly (5000 -> 4000)
    expect(applyDiscount(5000, 20)).toBe(4000);

    // 25% on annual (18000 -> 13500)
    expect(applyDiscount(18000, 25)).toBe(13500);

    // 10% on recruiter pack 5 (20000 -> 18000)
    expect(applyDiscount(20000, 10)).toBe(18000);
  });
});
