import hydraulic from "@/assets/hydraulic.jpg";
import packaging from "@/assets/packaging.jpg";
import fasteners from "@/assets/fasteners.jpg";
import plastics from "@/assets/plastics.jpg";
import plywood from "@/assets/plywood.jpg";
import hvac from "@/assets/hvac.jpg";
import tariffItemsJson from "@/data/tariff-items.json";

export type TariffItem = { code: string; heading: string; description: string; rate: number };
// Finance Canada counter-tariff schedule (effective Sept 8, 2026), loaded from the user-supplied spreadsheet.
export const tariffItems = tariffItemsJson as TariffItem[];

export const sectorByChapter: Record<string, string> = {
  "04": "Food & Dairy", "17": "Food & Dairy", "19": "Food & Dairy",
  "33": "Chemicals & Cosmetics", "35": "Chemicals & Cosmetics", "39": "Plastics",
  "44": "Wood & Paper", "47": "Wood & Paper", "48": "Wood & Paper", "49": "Wood & Paper",
  "57": "Textiles & Apparel", "61": "Textiles & Apparel", "62": "Textiles & Apparel",
  "68": "Building Materials", "70": "Building Materials",
  "72": "Steel", "73": "Steel", "74": "Copper & Aluminum", "76": "Copper & Aluminum",
  "82": "Tools & Hardware", "83": "Tools & Hardware", "84": "Machinery & Electrical", "85": "Machinery & Electrical",
  "86": "Vehicles & Rail", "87": "Vehicles & Rail", "94": "Furniture & Consumer Goods", "95": "Furniture & Consumer Goods",
};
export const sectorFor = (code: string) => sectorByChapter[code.slice(0, 2)] ?? "Other";

export type Opportunity = {
  id: string;
  name: string;
  sector: string;
  hsCode: string;
  tariff: number;
  /** Market figures are null until verified data is supplied. */
  tam: number | null;
  capex: number | null;
  margin: number | null;
  feasibility: number | null;
  image?: string | undefined;
  description: string;
  sourcing: string[];
  location: string;
};

// Photos only (no figures): market data comes from the database once verified uploads are loaded.
const images: Record<string, string> = {
  "8412.21.00": hydraulic, "7612.90.00": packaging, "7318.15.00": fasteners,
  "3926.90.00": plastics, "4412.33.00": plywood, "8415.82.10": hvac,
};

export type MarketRow = { hs_code: string; us_import_value_cad: number | null };
export type EconRow = { hs_code: string; retool_capex_cad: number | null; gross_margin_pct: number | null; feasibility_score: number | null };
export type SupplierRow = { hs_code: string; name: string; province: string | null; city: string | null };

const shortName = (heading: string) => {
  const first = heading.split(/[;:]/)[0]!.replace(/\.$/, "").trim();
  return first.length > 80 ? `${first.slice(0, 77).replace(/[ ,]+\S*$/, "")}…` : first;
};

/** Joins tariff items with any per-HS-code market, economics and supplier data. Missing data stays null. */
export function buildOpportunities(items: TariffItem[], market: MarketRow[] = [], econ: EconRow[] = [], suppliers: SupplierRow[] = []): Opportunity[] {
  const m = new Map(market.map((r) => [r.hs_code, r]));
  const e = new Map(econ.map((r) => [r.hs_code, r]));
  return items.map((t) => {
    const mk = m.get(t.code), ec = e.get(t.code);
    const sup = suppliers.filter((s) => s.hs_code === t.code);
    return {
      id: t.code, name: shortName(t.heading), sector: sectorFor(t.code), hsCode: t.code, tariff: t.rate,
      tam: mk?.us_import_value_cad ?? null, capex: ec?.retool_capex_cad ?? null,
      margin: ec?.gross_margin_pct != null ? Number(ec.gross_margin_pct) : null, feasibility: ec?.feasibility_score ?? null,
      image: images[t.code], description: t.description.replace(/^-\s*/, ""),
      sourcing: sup.map((s) => [s.name, s.city, s.province].filter(Boolean).join(" · ")),
      location: [...new Set(sup.map((s) => s.province).filter(Boolean))].join(" · "),
    };
  });
}

export const opportunitiesData: Opportunity[] = buildOpportunities(tariffItems);

export const sectorList = [...new Set(opportunitiesData.map((o) => o.sector))].sort();

export function marketplaceStats(items: Pick<Opportunity, "tariff" | "sector" | "tam">[]) {
  const count = items.length;
  const avgTariff = count ? Math.round(items.reduce((s, o) => s + o.tariff, 0) / count * 10) / 10 : 0;
  const at50 = items.filter((o) => o.tariff === 50).length;
  const sectorCount = new Set(items.map((o) => o.sector)).size;
  const withTam = items.filter((o) => o.tam != null);
  const knownTam = withTam.reduce((s, o) => s + (o.tam ?? 0), 0);
  // Rough estimate: scale the known import value up to the full list. Clearly an extrapolation, not verified data.
  const estimatedTam = withTam.length ? Math.round(knownTam / withTam.length * count) : null;
  return { count, avgTariff, at50, sectorCount, knownTam, withTamCount: withTam.length, estimatedTam };
}

/** Compact money label: "Pending" when unknown, $1.2B above a billion, $840M below. */
export const shortMoney = (value: number | null) => value == null ? "Pending" : value >= 1_000_000_000 ? `$${(value / 1_000_000_000).toFixed(1)}B` : `$${Math.round(value / 1_000_000)}M`;


export function calculateFinancials(opportunity: { tam: number | null; margin: number | null; capex: number | null }, marketShare: number, gtmBudget: number, acquisitionBudget: number, grantOffset: number) {
  const tam = opportunity.tam ?? 0, margin = opportunity.margin ?? 0, capex = opportunity.capex ?? 0;
  const targetRevenue = tam * marketShare / 100;
  const annualGrossProfit = targetRevenue * margin / 100;
  const grossInvestment = capex + gtmBudget + acquisitionBudget;
  const incentiveSaved = grossInvestment * grantOffset / 100;
  const netCapital = grossInvestment - incentiveSaved;
  const paybackMonths = annualGrossProfit > 0 ? Math.round(netCapital / annualGrossProfit * 12) : 0;
  return { targetRevenue, annualGrossProfit, grossInvestment, incentiveSaved, netCapital, paybackMonths };
}
