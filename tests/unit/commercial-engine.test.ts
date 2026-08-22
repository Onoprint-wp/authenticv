import { describe, it, expect } from "vitest";
import {
  calculateAutomatedCommissions,
  calculateGamificationStatus,
} from "@/lib/commercial-engine";

describe("Commercial Engine (Règles Commerciales & Commissions CEMAC)", () => {
  it("should accurately compute 10% agent commission and 2.5% director override", () => {
    const saleAmount = 100000; // 100 000 XAF
    const result = calculateAutomatedCommissions(saleAmount, true);

    expect(result.amountXaf).toBe(100000);
    expect(result.agentCommissionXaf).toBe(10000); // 10%
    expect(result.directorOverrideXaf).toBe(2500); // 2.5%
    expect(result.platformNetXaf).toBe(87500); // 87.5%
  });

  it("should not allocate director override if hasDirector is false", () => {
    const saleAmount = 50000;
    const result = calculateAutomatedCommissions(saleAmount, false);

    expect(result.agentCommissionXaf).toBe(5000);
    expect(result.directorOverrideXaf).toBe(0);
    expect(result.platformNetXaf).toBe(45000);
  });

  it("should evaluate gamification tier properly based on target progress", () => {
    const target = 500000;

    const rookie = calculateGamificationStatus(100000, target);
    expect(rookie.tier).toBe("bronze");
    expect(rookie.bonusEligible).toBe(false);

    const silver = calculateGamificationStatus(300000, target);
    expect(silver.tier).toBe("silver");
    expect(silver.bonusEligible).toBe(false);

    const gold = calculateGamificationStatus(500000, target);
    expect(gold.tier).toBe("gold");
    expect(gold.bonusEligible).toBe(true);
    expect(gold.bonusAmountXaf).toBe(10000);

    const diamond = calculateGamificationStatus(1200000, target);
    expect(diamond.tier).toBe("diamond");
    expect(diamond.bonusEligible).toBe(true);
    expect(diamond.bonusAmountXaf).toBe(25000);
  });
});
