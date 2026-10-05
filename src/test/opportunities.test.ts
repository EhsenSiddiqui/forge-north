import { describe, expect, it } from "vitest";
import { calculateFinancials, marketplaceStats, opportunitiesData, tariffItems } from "../lib/opportunities";

describe("opportunity financial model", () => {
  it("calculates the default scenario", () => {
    expect(calculateFinancials({ tam: 84_000_000, margin: 32, capex: 480_000 }, 10, 250_000, 0, 35)).toEqual({
      targetRevenue: 8_400_000,
      annualGrossProfit: 2_688_000,
      grossInvestment: 730_000,
      incentiveSaved: 255_500,
      netCapital: 474_500,
      paybackMonths: 2,
    });
  });

  it("includes a full plant acquisition and zero grant offset", () => {
    const result = calculateFinancials({ tam: 52_000_000, margin: 35, capex: 350_000 }, 1, 50_000, 5_000_000, 0);
    expect(result.netCapital).toBe(5_400_000);
    expect(result.paybackMonths).toBe(356);
  });
});

describe("official tariff schedule", () => {
  it("loads all 648 tariff items from the spreadsheet", () => {
    expect(tariffItems).toHaveLength(648);
  });

  it("puts every schedule item in the marketplace with the schedule's rate", () => {
    expect(opportunitiesData).toHaveLength(648);
    expect(opportunitiesData.find((o) => o.hsCode === "8415.82.10")?.tariff).toBe(15);
  });

  it("computes marketplace stats from the data", () => {
    const stats = marketplaceStats(opportunitiesData);
    expect(stats.count).toBe(648);
    expect(stats.at50).toBe(413);
    expect(stats.avgTariff).toBe(40.6);
  });
});

describe("HS code linking", () => {
  it("attaches market, economics and suppliers by HS code and leaves other codes pending", async () => {
    const { buildOpportunities } = await import("../lib/opportunities");
    const items = [{ code: "7318.15.00", heading: "Bolts", description: "", rate: 50 }, { code: "4412.33.00", heading: "Plywood", description: "", rate: 50 }];
    const [a, b] = buildOpportunities(items, [{ hs_code: "7318.15.00", us_import_value_cad: 1000 }], [{ hs_code: "7318.15.00", retool_capex_cad: 200, gross_margin_pct: 30, feasibility_score: 80 }], [{ hs_code: "7318.15.00", name: "Acme", province: "ON", city: null }]);
    expect(a).toMatchObject({ tam: 1000, capex: 200, margin: 30, feasibility: 80, location: "ON" });
    expect(b).toMatchObject({ tam: null, capex: null, margin: null, feasibility: null });
  });
});
