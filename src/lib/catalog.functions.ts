import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { buildOpportunities, type TariffItem } from "./opportunities";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Full marketplace: every tariff item joined with its market, economics and supplier rows by HS code. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const [t, m, e, s] = await Promise.all([
    db.from("tariff_items").select("hs_code, heading, description, surtax_rate").order("hs_code").limit(5000),
    db.from("market_data").select("hs_code, us_import_value_cad").limit(5000),
    db.from("unit_economics").select("hs_code, retool_capex_cad, gross_margin_pct, feasibility_score").limit(5000),
    db.from("suppliers").select("hs_code, name, province, city").limit(10000),
  ]);
  const err = t.error ?? m.error ?? e.error ?? s.error;
  if (err) throw new Error(err.message);
  const items: TariffItem[] = (t.data ?? []).map((r) => ({ code: r.hs_code, heading: r.heading, description: r.description, rate: r.surtax_rate }));
  return buildOpportunities(items, m.data ?? [], e.data ?? [], s.data ?? []);
});

/** Everything linked to one HS code: suppliers plus funding programs for that code, its sector, or all codes. */
export const getHsDetails = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ hsCode: z.string().min(4).max(20), sector: z.string().max(100) }).parse(d))
  .handler(async ({ data }) => {
    const db = publicClient();
    const [s, f, m, e] = await Promise.all([
      db.from("suppliers").select("name, province, city, supplier_type, website, notes, source").eq("hs_code", data.hsCode).order("name"),
      db.from("funding_programs").select("name, provider, program_type, max_pct, max_amount_cad, url, notes, hs_code, sector")
        .or(`hs_code.eq.${data.hsCode},and(hs_code.is.null,sector.is.null),and(hs_code.is.null,sector.eq."${data.sector.replace(/"/g, "")}")`),
      db.from("market_data").select("us_import_value_cad, total_import_value_cad, data_year, source").eq("hs_code", data.hsCode).maybeSingle(),
      db.from("unit_economics").select("notes, source").eq("hs_code", data.hsCode).maybeSingle(),
    ]);
    const err = s.error ?? f.error ?? m.error ?? e.error;
    if (err) throw new Error(err.message);
    return { suppliers: s.data ?? [], funding: f.data ?? [], market: m.data, economics: e.data };
  });
