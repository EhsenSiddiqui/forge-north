CREATE TABLE public.tariff_items (
  hs_code text PRIMARY KEY,
  heading text NOT NULL,
  description text NOT NULL DEFAULT '',
  surtax_rate integer NOT NULL,
  sector text NOT NULL DEFAULT 'Other',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.market_data (
  hs_code text PRIMARY KEY REFERENCES public.tariff_items(hs_code) ON DELETE CASCADE,
  us_import_value_cad bigint,
  total_import_value_cad bigint,
  data_year integer,
  source text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.unit_economics (
  hs_code text PRIMARY KEY REFERENCES public.tariff_items(hs_code) ON DELETE CASCADE,
  retool_capex_cad bigint,
  gross_margin_pct numeric,
  feasibility_score integer,
  notes text,
  source text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hs_code text NOT NULL REFERENCES public.tariff_items(hs_code) ON DELETE CASCADE,
  name text NOT NULL,
  province text,
  city text,
  supplier_type text,
  website text,
  notes text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX suppliers_hs_code_idx ON public.suppliers(hs_code);
CREATE TABLE public.funding_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hs_code text REFERENCES public.tariff_items(hs_code) ON DELETE CASCADE,
  sector text,
  name text NOT NULL,
  provider text,
  program_type text,
  max_pct numeric,
  max_amount_cad bigint,
  url text,
  notes text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX funding_programs_hs_code_idx ON public.funding_programs(hs_code);
GRANT SELECT ON public.tariff_items TO anon, authenticated;
GRANT ALL ON public.tariff_items TO service_role;
ALTER TABLE public.tariff_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tariff_items" ON public.tariff_items FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.market_data TO anon, authenticated;
GRANT ALL ON public.market_data TO service_role;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read market_data" ON public.market_data FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.unit_economics TO anon, authenticated;
GRANT ALL ON public.unit_economics TO service_role;
ALTER TABLE public.unit_economics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read unit_economics" ON public.unit_economics FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.suppliers TO anon, authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read suppliers" ON public.suppliers FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.funding_programs TO anon, authenticated;
GRANT ALL ON public.funding_programs TO service_role;
ALTER TABLE public.funding_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read funding_programs" ON public.funding_programs FOR SELECT TO anon, authenticated USING (true);