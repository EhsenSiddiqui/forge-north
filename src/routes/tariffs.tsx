import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog.functions";

export const Route = createFileRoute("/tariffs")({
  head: () => ({ meta: [
    { title: "Counter-Tariff Schedule | ForgeNorth" },
    { name: "description", content: "Search every U.S. product on Canada's counter-tariff schedule by tariff code, product, and surtax rate." },
    { property: "og:title", content: "Counter-Tariff Schedule | ForgeNorth" },
    { property: "og:description", content: "Search every U.S. product on Canada's counter-tariff schedule by tariff code, product, and surtax rate." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: () => getCatalog(),
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm">Could not load the schedule: {(error as Error).message}</div>,
  component: TariffSchedule,
});

const PAGE = 50;

function TariffSchedule() {
  const catalog = Route.useLoaderData();
  const tariffItems = useMemo(() => catalog.map((o) => ({ code: o.hsCode, heading: o.name, description: o.description, rate: o.tariff })), [catalog]);
  const [query, setQuery] = useState("");
  const [rate, setRate] = useState("all");
  const [limit, setLimit] = useState(PAGE);

  const counts = useMemo(() => [15, 25, 50].map((r) => [r, tariffItems.filter((t) => t.rate === r).length] as const), [tariffItems]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tariffItems.filter((t) =>
      (rate === "all" || t.rate === Number(rate)) &&
      (!q || t.code.includes(q) || t.code.replace(/\./g, "").includes(q) || t.heading.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)));
  }, [tariffItems, query, rate]);

  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-brand-accent"><ArrowLeft className="size-4" /> Opportunity engine</Link>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-10">
      <div className="section-kicker">OFFICIAL SCHEDULE · EFFECTIVE SEPT 8, 2026</div>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Canadian counter-tariff schedule</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{tariffItems.length} U.S. tariff items subject to Canadian surtax, from the list you supplied.</p>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
        {counts.map(([r, n]) => <div key={r} className="border border-border bg-surface p-3"><div className="text-lg font-semibold text-alert">{r}%</div><div className="text-xs text-muted-foreground">{n} items</div></div>)}
      </div>
      <div className="sticky top-0 z-10 mt-8 grid gap-3 border-y border-border bg-background py-4 sm:grid-cols-[1fr_200px]">
        <label className="relative block"><span className="sr-only">Search tariff items</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }} placeholder="Search tariff code or product" className="h-11 pl-9" /></label>
        <select aria-label="Surtax rate" value={rate} onChange={(e) => { setRate(e.target.value); setLimit(PAGE); }} className="h-11 rounded-sm border border-border bg-background px-3 text-sm"><option value="all">All rates</option><option value="15">15%</option><option value="25">25%</option><option value="50">50%</option></select>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Showing <strong className="text-foreground">{Math.min(limit, filtered.length)}</strong> of {filtered.length}</p>
      <div className="mt-3 overflow-x-auto border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-[0.1em] text-muted-foreground"><tr><th className="p-3">Tariff item</th><th className="p-3">Product heading</th><th className="p-3">Description</th><th className="p-3 text-right">Surtax</th></tr></thead>
          <tbody>{filtered.slice(0, limit).map((t) => <tr key={t.code} className="border-b border-border align-top last:border-0">
            <td className="whitespace-nowrap p-3 font-mono text-xs font-semibold">{t.code}</td>
            <td className="p-3 text-xs">{t.heading}</td>
            <td className="p-3 text-xs text-muted-foreground">{t.description}</td>
            <td className="p-3 text-right font-semibold text-alert">{t.rate}%</td>
          </tr>)}</tbody>
        </table>
      </div>
      {limit < filtered.length && <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimit(limit + PAGE)}>Show more</Button></div>}
    </main>

    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:px-8 lg:px-10">
        <span>FORGE<span className="text-brand-accent">NORTH</span> — Manufacturing intelligence for a stronger Canada.</span>
        <span className="flex flex-wrap items-center gap-4"><Link to="/data-sources" className="font-semibold text-foreground hover:text-brand-accent">Data sources</Link><span>Demonstration platform · Not investment advice.</span></span>
      </div>
    </footer>
  </div>;
}
