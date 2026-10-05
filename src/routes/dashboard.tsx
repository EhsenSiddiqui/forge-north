import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCatalog, getHsDetails } from "@/lib/catalog.functions";
import { matchOpportunitiesToProfile, type AiMatch } from "@/lib/match.functions";
import { ArrowRight, Sparkles, ArrowUpRight, BadgeCheck, Building2, ChevronDown, Download, Factory, FileText, Landmark, Leaf, Menu, Search, ShieldAlert, SlidersHorizontal, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateFinancials, marketplaceStats, shortMoney, type Opportunity } from "@/lib/opportunities";
import { demoProfile, readCompanyProfile, type CompanyProfile } from "@/lib/company-profile";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Opportunity Dashboard | ForgeNorth" },
    { name: "description", content: "Explore illustrative Canadian import-replacement opportunities and model manufacturing investment scenarios." },
    { property: "og:title", content: "Opportunity Dashboard | ForgeNorth" },
    { property: "og:description", content: "Explore illustrative Canadian import-replacement opportunities and model manufacturing investment scenarios." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: () => getCatalog(),
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm">Could not load the marketplace: {(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center text-sm">Not found</div>,
  component: Index,
});

const money = (value: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
const PAGE = 24;
const optMoney = (value: number | null) => value == null ? "Pending" : money(value);

function Index() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  useEffect(() => { setProfile(readCompanyProfile()); }, []);
  const opportunitiesData = Route.useLoaderData();
  const allStats = useMemo(() => marketplaceStats(opportunitiesData), [opportunitiesData]);
  const sectorList = useMemo(() => [...new Set(opportunitiesData.map((o) => o.sector))].sort(), [opportunitiesData]);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All sectors");
  const [minTariff, setMinTariff] = useState("0");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const matchFn = useServerFn(matchOpportunitiesToProfile);
  const [aiMatches, setAiMatches] = useState<Map<string, AiMatch> | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const runAiMatch = async () => {
    const p = profile ?? readCompanyProfile() ?? demoProfile;
    setAiLoading(true); setAiError(null);
    try {
      const res = await matchFn({ data: { profile: p, candidates: opportunitiesData.map((o) => ({ id: o.id, hs: o.hsCode, name: o.name.slice(0, 90), sector: o.sector })) } });
      if (res.error) setAiError(res.error);
      else { setAiMatches(new Map(res.matches.map((m) => [m.id, m]))); setLimit(PAGE); }
    } catch (e) { console.error("[ai-match-client]", e); setAiError("The AI match couldn't be completed. Please try again."); }
    finally { setAiLoading(false); }
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunitiesData.filter((item) =>
      (!aiMatches || aiMatches.has(item.id)) &&
      (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.hsCode.includes(q) || item.hsCode.replace(/\./g, "").includes(q)) &&
      (sector === "All sectors" || item.sector === sector) && (minTariff === "0" || item.tariff === Number(minTariff)))
      .sort((a, b) => {
        if (aiMatches) return (aiMatches.get(b.id)?.score ?? 0) - (aiMatches.get(a.id)?.score ?? 0);
        // Items with a verified import market (TAM) come first, largest first
        if (a.tam != null && b.tam != null) return b.tam - a.tam;
        if (a.tam != null) return -1;
        if (b.tam != null) return 1;
        return 0;
      });
  }, [opportunitiesData, query, sector, minTariff, aiMatches]);
  const stats = useMemo(() => marketplaceStats(filtered), [filtered]);

  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link to="/" aria-label="ForgeNorth home" className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center bg-brand-accent text-primary-foreground"><Factory className="size-5" strokeWidth={1.7} /></div>
          <div className="min-w-0 leading-tight"><div className="truncate text-[15px] font-bold tracking-tight text-foreground">FORGE<span className="text-brand-accent">NORTH</span><span className="font-normal text-muted-foreground"> // </span> <span className="hidden sm:inline">OPPORTUNITY ENGINE</span></div><div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">They raise tariffs. We raise factories.</div></div>
        </Link>
        <div className="hidden md:flex items-center gap-6"><Link to="/onboarding" className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-brand-accent"><Building2 className="size-4" /> {profile ? "Edit profile" : "Company profile"}</Link><Link to="/tariffs" className="text-xs font-semibold text-foreground hover:text-brand-accent">Tariff schedule ({opportunitiesData.length})</Link></div>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-muted" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</Button>
      </div>
      {mobileMenu && <div className="border-t border-border px-5 py-3 md:hidden space-y-3"><Link to="/onboarding" className="block text-sm font-semibold">{profile ? "Edit profile" : "Company profile"}</Link><Link to="/tariffs" className="block text-sm font-semibold">Tariff schedule ({opportunitiesData.length})</Link></div>}
    </header>

    <main>
      {profile && <section className="border-b border-border bg-surface"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-10"><div className="flex min-w-0 items-center gap-3"><Building2 className="size-4 shrink-0 text-brand-accent" /><span className="truncate text-sm font-semibold">{profile.companyName}</span><span className="hidden text-xs text-muted-foreground sm:inline">· {profile.city ? `${profile.city}, ` : ""}{profile.region} · {profile.verticals.join(" / ")}</span><span className="shrink-0 border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Demo</span></div><Link to="/onboarding" className="text-xs font-semibold text-brand-accent hover:text-brand-accent-strong">Edit profile →</Link></div></section>}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_85%_20%,var(--hero-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-11 sm:px-8 sm:pb-16 sm:pt-15 lg:px-10 lg:pt-18">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-accent"><span className="h-4 w-6 rounded-sm bg-brand-accent" /> Canadian industrial opportunity intelligence</div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_265px] lg:items-end">
            <div><h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-[58px]">Turn trade disruption into <span className="text-brand-accent">domestic advantage.</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Translate U.S. trade counter-tariffs into high-yield domestic manufacturing opportunities. Explore import gaps, model the economics, and find your next move.</p></div>
            <div className="border-l border-border pl-5 lg:mb-1"><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Opportunity landscape</div><div className="mt-3 flex items-baseline gap-2"><span className="text-4xl font-semibold text-foreground">{allStats.count}</span><span className="text-sm text-muted-foreground">U.S. goods</span></div><p className="mt-1 text-xs text-muted-foreground">On Canada’s counter-tariff schedule · {allStats.at50} at 50%</p>{allStats.estimatedTam != null && <div className="mt-4 border-t border-border pt-3"><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Est. total U.S. import market</div><div className="mt-1 text-2xl font-semibold text-brand-accent">{shortMoney(allStats.estimatedTam)}<span className="text-xs font-normal text-muted-foreground"> / yr</span></div><p className="mt-1 text-[10px] leading-4 text-muted-foreground">Rough estimate: {shortMoney(allStats.knownTam)} verified across {allStats.withTamCount} goods, scaled to all {allStats.count}. Not verified.</p></div>}</div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          <SummaryStat icon={<Factory />} value={String(stats.count)} label="Tariffed goods in view" />
          <SummaryStat icon={<ShieldAlert />} value={`+${stats.avgTariff}%`} label="Avg. tariff protection" />
          <SummaryStat icon={<TrendingUp />} value={String(stats.at50)} label="Goods at 50% surtax" />
          <SummaryStat icon={<BadgeCheck />} value={String(stats.sectorCount)} label="Sectors covered" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-11 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5"><div><div className="section-kicker">THE OPPORTUNITY MARKETPLACE</div><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Explore import-replacement opportunities</h2><p className="mt-2 text-sm text-muted-foreground">A focused view of where Canadian production could capture displaced demand.</p></div><span className="text-xs text-muted-foreground">Showing <strong className="text-foreground">{filtered.length}</strong> of {opportunitiesData.length} opportunities</span></div>
        <div className="sticky top-0 z-20 mt-7 grid gap-3 border border-border bg-surface p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_180px_170px] lg:top-0">
          <label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><span className="sr-only">Search by product name or HS code</span><Input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE); }} placeholder="Search product or HS code..." className="h-11 rounded-sm border-border bg-background pl-10 shadow-none" /></label>
          <label className="relative block"><span className="sr-only">Filter by sector</span><select value={sector} onChange={(event) => { setSector(event.target.value); setLimit(PAGE); }} className="h-11 w-full appearance-none rounded-sm border border-border bg-background px-3 pr-8 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"><option>All sectors</option>{sectorList.map((s) => <option key={s}>{s}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></label>
          <label className="relative block"><span className="sr-only">Minimum tariff rate</span><select value={minTariff} onChange={(event) => { setMinTariff(event.target.value); setLimit(PAGE); }} className="h-11 w-full appearance-none rounded-sm border border-border bg-background px-3 pr-8 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"><option value="0">Any tariff rate</option><option value="15">15% tariff</option><option value="25">25% tariff</option><option value="50">50% tariff</option></select><SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border border-brand-accent/30 bg-brand-accent/5 p-3">
          <Button onClick={runAiMatch} disabled={aiLoading} className="rounded-sm bg-brand-accent text-primary-foreground hover:bg-brand-accent-strong"><Sparkles className="size-4" /> {aiLoading ? "Matching to your factory…" : aiMatches ? "Re-run AI match" : "AI match to my capabilities"}</Button>
          {aiMatches && <Button variant="outline" className="rounded-sm" onClick={() => setAiMatches(null)}><X className="size-4" /> Show all</Button>}
          <span className="text-xs text-muted-foreground">{aiLoading ? "AI is comparing all products against your equipment, skills and certifications (about 30–60 s)." : aiMatches ? `${aiMatches.size} products you could make with your current setup${profile ? ` at ${profile.companyName}` : ""}. AI suggestions on demo profile data — verify before acting.` : `Uses ${profile ? profile.companyName : "the demo company"} profile to show only products you can make with your current equipment.`}</span>
          {aiError && <span className="w-full text-xs font-semibold text-alert">{aiError}</span>}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, limit).map((item) => <OpportunityCard key={item.id} item={item} match={aiMatches?.get(item.id)} />)}
        </div>
        {limit < filtered.length && <div className="mt-8 text-center"><Button variant="outline" onClick={() => setLimit(limit + PAGE)}>Show more ({filtered.length - limit} remaining)</Button></div>}
        {filtered.length === 0 && <div className="py-20 text-center"><Search className="mx-auto size-8 text-muted-foreground" /><h3 className="mt-4 font-semibold">No matching opportunities</h3><p className="mt-2 text-sm text-muted-foreground">Try a different search or adjust your filters.</p><Button className="mt-5" variant="outline" onClick={() => { setQuery(""); setSector("All sectors"); setMinTariff("0"); }}>Clear filters</Button></div>}
        <p className="mt-9 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">Tariff items and surtax rates come from the counter-tariff schedule you supplied. Market sizes, costs, margins, suppliers and funding are looked up by HS code and show as pending until verified data is uploaded. Not investment advice.</p>
      </div>
    </main>

    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:px-8 lg:px-10">
        <span>FORGE<span className="text-brand-accent">NORTH</span> — Manufacturing intelligence for a stronger Canada.</span>
        <span className="flex flex-wrap items-center gap-4"><Link to="/data-sources" className="font-semibold text-foreground hover:text-brand-accent">Data sources</Link><span>Demonstration platform · Not investment advice.</span></span>
      </div>
    </footer>
  </div>;
}


function SummaryStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="flex min-h-24 items-center gap-3 px-3 py-4 first:pl-0 last:pr-0 sm:gap-4 sm:px-6"><div className="hidden size-10 shrink-0 items-center justify-center bg-muted text-primary sm:flex [&_svg]:size-5">{icon}</div><div><div className="text-xl font-semibold sm:text-2xl">{value}</div><div className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{label}</div></div></div>;
}

function OpportunityCard({ item, match }: { item: Opportunity; match?: AiMatch | undefined }) {
  return <article className="group flex flex-col overflow-hidden border border-border bg-surface transition-shadow hover:shadow-md">
    {item.image ? <div className="relative h-40 overflow-hidden"><img src={item.image} alt={item.name} loading="lazy" width={1008} height={656} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div> : <div className="h-1.5 bg-brand-accent/80" />}
    <div className="flex min-w-0 flex-1 flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="border border-border bg-muted px-2 py-1 font-mono text-[11px] font-semibold">HS {item.hsCode}</span><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.sector}</span></div>
      <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug">{item.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
      {match && <div className="mt-3 border-l-2 border-brand-accent bg-brand-accent/5 px-3 py-2 text-xs leading-5"><span className="font-semibold text-brand-accent"><Sparkles className="mr-1 inline size-3" />AI fit score {match.score}%</span><span className="block text-muted-foreground">{match.reason}</span></div>}
      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3">
        <div><div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">U.S. surtax</div><div className="mt-1 text-lg font-semibold text-alert">+{item.tariff}%</div></div>
        <div><div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Import market</div><div className={`mt-1 text-lg font-semibold ${item.tam == null ? "text-muted-foreground" : ""}`}>{shortMoney(item.tam)}{item.tam != null && <span className="text-xs font-normal text-muted-foreground"> / yr</span>}</div></div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4"><span className="truncate text-xs text-muted-foreground">{item.feasibility != null ? `${item.feasibility}% match` : item.capex != null ? `Retool ${optMoney(item.capex)}` : item.margin != null ? `${item.margin}% margin` : "Data pending"}</span><Button asChild size="sm" className="h-9 shrink-0 rounded-sm px-3 text-xs"><Link to="/analyze/$id" params={{ id: item.id }}>Analyze <ArrowUpRight className="size-3.5" /></Link></Button></div>
    </div>
  </article>;
}

