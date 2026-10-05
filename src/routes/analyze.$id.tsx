import { createFileRoute, Link, Outlet, notFound, redirect, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Building2, Check } from "lucide-react";
import { getCatalog } from "@/lib/catalog.functions";
import { readCompanyProfile, type CompanyProfile } from "@/lib/company-profile";

const STEPS = [
  { to: "/analyze/$id/fit", num: "01", label: "Fit assessment" },
  { to: "/analyze/$id/market", num: "02", label: "Market intelligence" },
  { to: "/analyze/$id/finance", num: "03", label: "Financial engine" },
  { to: "/analyze/$id/capital", num: "04", label: "Capital & execution" },
  { to: "/analyze/$id/funding", num: "05", label: "Funding & investors" },
  { to: "/analyze/$id/act", num: "06", label: "Put it to work" },
] as const;

export const Route = createFileRoute("/analyze/$id")({
  beforeLoad: ({ params, location }) => {
    if (location.pathname === `/analyze/${params.id}`) {
      throw redirect({ to: "/analyze/$id/fit", params, replace: true });
    }
  },
  loader: async ({ params }) => {
    const items = await getCatalog();
    const item = items.find((o) => o.id === params.id);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.name ?? "Opportunity"} analysis | ForgeNorth`;
    const d = `Fit assessment, market intelligence and financial model for HS ${loaderData?.hsCode ?? ""}.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm">Could not load this analysis: {(error as Error).message}</div>,
  notFoundComponent: () => <div className="p-10 text-center text-sm">Opportunity not found. <Link to="/dashboard" className="text-brand-accent">Back to dashboard</Link></div>,
  component: AnalyzeLayout,
});

function AnalyzeLayout() {
  const item = Route.useLoaderData();
  const location = useLocation();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  useEffect(() => { setProfile(readCompanyProfile()); }, []);
  const current = STEPS.findIndex((s) => location.pathname.endsWith(s.to.replace("/analyze/$id", "")));
  const progress = current < 0 ? 0 : ((current + 1) / STEPS.length) * 100;
  const last = STEPS[STEPS.length - 1]?.num ?? String(STEPS.length).padStart(2, "0");
  const currentStep = current >= 0 ? STEPS[current] : undefined;
  const stepsRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const ol = stepsRef.current;
    const el = ol?.querySelector<HTMLElement>("[data-step-active]");
    if (ol && el) ol.scrollTo({ left: el.offsetLeft - ol.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
  }, [location.pathname]);
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0"><div className="section-kicker">OPPORTUNITY WORKSPACE / HS {item.hsCode}</div><h1 className="mt-1 truncate text-lg font-semibold sm:text-xl">{item.name}</h1></div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {currentStep && <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground md:inline">Step {currentStep.num} of {last}</span>}
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold hover:text-brand-accent"><ArrowLeft className="size-4" /> Dashboard</Link>
        </div>
      </div>
      <nav aria-label="Analysis steps" className="border-t border-border bg-background">
        {currentStep && <div className="mx-auto max-w-[1500px] px-5 pt-3 text-xs font-bold uppercase tracking-[0.14em] text-brand-accent sm:px-8 md:hidden">Step {currentStep.num} of {last} · {currentStep.label}</div>}
        <ol ref={stepsRef} className="mx-auto flex max-w-[1500px] gap-1.5 overflow-x-auto px-4 py-2.5 [mask-image:linear-gradient(to_right,black_88%,transparent)] sm:gap-3 sm:px-8 sm:py-3 md:[mask-image:none]">
          {STEPS.map((step, i) => {
            const active = i === current;
            const done = current >= 0 && i < current;
            return <li key={step.to} className="shrink-0 sm:min-w-0 sm:flex-1">
              <Link to={step.to} params={{ id: item.id }} data-step-active={active ? "true" : undefined} aria-current={active ? "step" : undefined} className={`flex w-full items-center gap-2 whitespace-nowrap rounded-md border px-2.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-[13px] ${active ? "border-brand-accent bg-brand-accent text-brand-accent-foreground shadow-sm" : done ? "border-brand-accent/30 bg-brand-accent-soft text-foreground hover:border-brand-accent/60" : "border-border bg-surface text-muted-foreground hover:border-brand-accent/40 hover:text-foreground"}`}>
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${active ? "bg-brand-accent-foreground/25 text-brand-accent-foreground" : done ? "bg-brand-accent text-brand-accent-foreground" : "bg-muted text-muted-foreground"}`}>{done ? <Check className="size-3.5" /> : step.num}</span>
                <span>{step.label}</span>
              </Link>
            </li>;
          })}
        </ol>
        <div className="h-1 w-full bg-border"><div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      </nav>
    </header>
    <main className="mx-auto max-w-[1500px] space-y-10 px-5 py-8 sm:px-8">
      <section className="border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Building2 className="size-5 text-brand-accent" /><span className="text-lg font-semibold">{profile?.companyName ?? "No company profile yet"}</span>{profile && <span className="border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Demo</span>}</div>
          <Link to="/onboarding" className="text-sm font-semibold text-brand-accent hover:text-brand-accent-strong">{profile ? "Edit profile →" : "Create profile →"}</Link>
        </div>
        {profile && <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Location</dt><dd className="mt-1">{profile.city ? `${profile.city}, ` : ""}{profile.region}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Verticals</dt><dd className="mt-1">{profile.verticals.join(", ")}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Certifications</dt><dd className="mt-1">{[...profile.certifications, profile.otherCertifications].filter(Boolean).join(", ")}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Capabilities</dt><dd className="mt-1 line-clamp-3">{profile.capabilities}</dd></div>
        </dl>}
      </section>
      <Outlet />
    </main>
  </div>;
}
