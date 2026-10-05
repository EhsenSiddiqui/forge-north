import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Database, ExternalLink, Factory, FileCheck2, Landmark, Scale, ShieldCheck } from "lucide-react";
import { getCatalog } from "@/lib/catalog.functions";
import { marketplaceStats } from "@/lib/opportunities";

export const Route = createFileRoute("/data-sources")({
  head: () => ({ meta: [
    { title: "Data Sources | ForgeNorth" },
    { name: "description", content: "The official Canadian trade, tariff and funding sources behind ForgeNorth — and exactly which figures are verified versus still pending." },
    { property: "og:title", content: "Data Sources | ForgeNorth" },
    { property: "og:description", content: "The official Canadian trade, tariff and funding sources behind ForgeNorth — and exactly which figures are verified versus still pending." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: () => getCatalog(),
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm">Could not load coverage figures: {(error as Error).message}</div>,
  component: DataSources,
});

type Source = { org: string; name: string; url: string; use: string };

const TRADE_SOURCES: Source[] = [
  {
    org: "Department of Finance Canada",
    name: "Canada’s response to U.S. tariffs — complete list of U.S. products subject to counter-tariffs",
    url: "https://www.canada.ca/en/department-finance/programs/international-trade-finance-policy/canadas-response-us-tariffs/complete-list-us-products-subject-to-counter-tariffs.html",
    use: "The product list and surtax rates that define the marketplace. Our working copy was supplied as a schedule file and loaded item by item, so every card is a real line on the schedule.",
  },
  {
    org: "Innovation, Science and Economic Development Canada",
    name: "Trade Data Online (TDO)",
    url: "https://ised-isde.canada.ca/app/ixb/tdo/crtr.html",
    use: "Annual Canadian import values originating from the United States, looked up by HS code. These become the “import market” figure on an opportunity card and the starting point of the financial model.",
  },
  {
    org: "Statistics Canada",
    name: "Canadian International Merchandise Trade (CIMT) portal",
    url: "https://www150.statcan.gc.ca/n1/pub/71-607-x/2021004/about_apropos-eng.htm",
    use: "Itemized U.S. import volumes into Canada, used to cross-check the trade flows behind a product line.",
  },
];

const FUNDING_SOURCES: Source[] = [
  {
    org: "Government of Canada — Open Canada",
    name: "Canada Business Grants & Financing Finder",
    url: "https://open.canada.ca/en/apps/canadian-business-grants-and-financing-finder",
    use: "Central index of non-repayable grants and financing supports, including tariff-response funding and process-optimization support.",
  },
  {
    org: "Government of Ontario",
    name: "Ontario Made Manufacturing Investment Tax Credit (OMMITC)",
    url: "https://www.ontario.ca/page/ontario-made-manufacturing-investment-tax-credit",
    use: "Official guidelines for the refundable tax credit on qualifying capital equipment — the basis for the incentive offset in the capital panel.",
  },
  {
    org: "Export Development Canada",
    name: "EDC growth and trade financing solutions",
    url: "https://www.edc.ca/en/solutions/financing.html",
    use: "Trade expansion credit lines and guarantees for businesses pivoting to domestic manufacturing.",
  },
];

const RULES = [
  { icon: ShieldCheck, title: "Verified or pending — never estimated", text: "A figure appears as a number only when it traces to a source we can name. Everything else is labelled “Pending” rather than filled in with a plausible guess." },
  { icon: Scale, title: "Granularity is stated", text: "Trade Data Online reports by six-digit HS group. Where several eight-digit items share one group, the same market total appears on each card, so a summed view can double-count." },
  { icon: FileCheck2, title: "Sample content is labelled", text: "Fit scores and the AI next-steps list on an analysis page are demonstration data for this proof of concept, and are flagged as illustrative wherever they appear." },
  { icon: Database, title: "Uploads land by HS code", text: "New spreadsheets are matched to the schedule on the HS code, so market values, costs, suppliers and programs attach to the right product line." },
];

function SourceCard({ s }: { s: Source }) {
  return <div className="flex flex-col border border-border bg-surface p-6">
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent">{s.org}</div>
    <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{s.name}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.use}</p>
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:text-brand-accent-strong">Open source <ExternalLink className="size-3.5" /></a>
  </div>;
}

function CoverageRow({ label, value, status, detail }: { label: string; value: string; status: "verified" | "partial" | "pending"; detail: string }) {
  const badgeText = status === "verified" ? "Loaded" : status === "partial" ? "Partial" : "Pending";
  return <div className="grid gap-2 border-b border-border py-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_150px_110px] sm:items-start sm:gap-5">
    <div className="text-sm font-semibold text-foreground">{label}</div>
    <div className="text-sm text-muted-foreground sm:order-3">{badgeText}</div>
    <div className="text-lg font-semibold sm:order-2 sm:text-right">{value}</div>
    <p className="text-xs leading-5 text-muted-foreground sm:col-span-3 sm:order-4">{detail}</p>
  </div>;
}

function DataSources() {
  const catalog = Route.useLoaderData();
  const stats = marketplaceStats(catalog);
  const byRate = [15, 25, 50].map((r) => catalog.filter((o) => o.tariff === r).length);
  const withEcon = catalog.filter((o) => o.capex != null || o.margin != null).length;
  const withSuppliers = catalog.filter((o) => o.sourcing.length > 0).length;
  const pendingMarket = stats.count - stats.withTamCount;

  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-brand-accent"><ArrowLeft className="size-4" /> Opportunity engine</Link>
        <Link to="/" aria-label="ForgeNorth home" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center bg-brand-accent text-primary-foreground"><Factory className="size-4" strokeWidth={1.7} /></div>
          <div className="text-[14px] font-bold tracking-tight">FORGE<span className="text-brand-accent">NORTH</span></div>
        </Link>
      </div>
    </header>

    <main>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-accent">Data provenance</div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">Where the numbers come from.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">ForgeNorth is only useful if a manufacturer can check our work. This page lists the official sources behind the platform and states, line by line, what is loaded, what is partial, and what is still pending.</p>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <h2 className="text-2xl font-semibold sm:text-3xl">Trade and counter-tariff data</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">The schedule tells us which goods carry a surtax. The trade data tells us how large the U.S. import market is.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TRADE_SOURCES.map((s) => <SourceCard key={s.url} s={s} />)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <h2 className="text-2xl font-semibold sm:text-3xl">Grants, financing and incentives</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Program eligibility is always confirmed on the official page before a manufacturer acts on it.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FUNDING_SOURCES.map((s) => <SourceCard key={s.url} s={s} />)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <h2 className="text-2xl font-semibold sm:text-3xl">What is loaded today</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Coverage across the {stats.count} tariffed product lines in the marketplace, checked against the live data.</p>
          <div className="mt-8 border border-border bg-surface px-5 sm:px-7">
            <CoverageRow
              label="Counter-tariff items and surtax rates"
              value={`${stats.count} items`}
              status="verified"
              detail={`Loaded item by item from the counter-tariff schedule supplied to us: ${byRate[0]} at 15%, ${byRate[1]} at 25%, ${byRate[2]} at 50%, across ${stats.sectorCount} sectors. The official Department of Finance page carries the published list.`}
            />
            <CoverageRow
              label="U.S. import market values"
              value={`${stats.withTamCount} of ${stats.count}`}
              status="partial"
              detail={`Pulled from ISED Trade Data Online for the 2025 reporting year, by six-digit HS group. The remaining ${pendingMarket} lines show “Pending” until their values are retrieved.`}
            />
            <CoverageRow
              label="Retool cost, gross margin and feasibility inputs"
              value={`${withEcon} of ${stats.count}`}
              status="pending"
              detail="These drive the financial engine. Until they are supplied for a product line, the model runs on zeros and the workspace asks you to enter values."
            />
            <CoverageRow
              label="Canadian suppliers by HS code"
              value={`${withSuppliers} of ${stats.count}`}
              status="pending"
              detail="Supplier shortlists attach to a product line only once a verified list is loaded."
            />
            <CoverageRow
              label="Funding program records by HS code"
              value="Illustrative"
              status="pending"
              detail="The government programs shown in a workspace are labelled illustrative samples for this demonstration. Verified program records load with your uploads."
            />
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
          <h2 className="text-2xl font-semibold sm:text-3xl">How we treat the numbers</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {RULES.map((r) => <div key={r.title} className="border border-border bg-background p-6">
              <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><r.icon className="size-5" /></div>
              <h3 className="mt-4 text-base font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{r.text}</p>
            </div>)}
          </div>
          <p className="mt-10 text-xs leading-5 text-muted-foreground">Nothing on this page is investment advice. Figures change with the published schedule and each new reporting year; the official sources above are the reference.</p>
        </div>
      </section>
    </main>

    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:px-8">
        <span>FORGE<span className="text-brand-accent">NORTH</span> — Manufacturing intelligence for a stronger Canada.</span>
        <span className="flex flex-wrap items-center gap-4">
          <Link to="/" className="font-semibold text-foreground hover:text-brand-accent">Home</Link>
          <Link to="/dashboard" className="font-semibold text-foreground hover:text-brand-accent">Dashboard</Link>
          <span className="font-semibold text-brand-accent">Data sources</span>
          <span>Demonstration platform · Not investment advice.</span>
        </span>
      </div>
    </footer>
  </div>;
}
