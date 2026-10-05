import { Fragment, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown, ArrowRight, Building2, ClipboardList, Cpu, Factory, FileSearch, Flag,
  Handshake, HeartPulse, LineChart, Search, Sparkles, UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog.functions";
import { marketplaceStats, opportunitiesData, shortMoney } from "@/lib/opportunities";
import analysisShot from "@/assets/app-analysis.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ForgeNorth | They raise tariffs. We raise factories." },
    { name: "description", content: "ForgeNorth helps Canadian manufacturers and investors turn trade disruption into domestic growth. Join the platform to explore opportunities and build your case with AI." },
    { property: "og:title", content: "ForgeNorth | They raise tariffs. We raise factories." },
    { property: "og:description", content: "ForgeNorth helps Canadian manufacturers and investors turn trade disruption into domestic growth. Join the platform to explore opportunities and build your case with AI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: async () => {
    try { return await getCatalog(); } catch { return null; }
  },
  component: Landing,
});

const PROBLEM_FLOW = [
  { title: "Trade disruption", text: "Changing trade conditions can make some imported U.S. products more expensive in Canada." },
  { title: "Market opportunity", text: "Import-replacement gaps appear across hundreds of tariffed product lines." },
  { title: "\u201CBut is it right for MY factory?\u201D", text: "Identifying an import gap is not enough — a manufacturer still needs to answer this." },
  { title: "ForgeNorth", text: "Connects market and trade signals with your business context to answer it.", highlight: true },
];

const JOURNEY = ["Profile", "Discover", "Analyze", "Act"];

const PERSPECTIVES = [
  { icon: ClipboardList, title: "Product", question: "Is the product opportunity itself attractive?" },
  { icon: Handshake, title: "Investor", question: "Is there a potentially relevant partnership or investment angle?" },
  { icon: HeartPulse, title: "Your business health", question: "How well does this opportunity align with your current business situation?" },
];

const ASSESSMENT_OUTPUTS = ["Fit score", "Risk indicator", "Question-level analysis", "Confidence level", "Supporting insights"];

const EVIDENCE = [
  { icon: LineChart, title: "Trade & market data", items: ["Product & HS code", "Tariff / surtax information", "Canadian import-market information"] },
  { icon: Building2, title: "Manufacturer input", items: ["Company & region", "Industry & capabilities", "Equipment & certifications", "Workforce & technical skills"] },
];

const AI_PIPELINE = ["Question", "Answer", "Fit score", "Confidence", "Supporting insights"];

const DECISION = [
  { icon: LineChart, title: "Market intelligence" },
  { icon: Sparkles, title: "AI assessment" },
  { icon: Cpu, title: "Financial engine" },
  { icon: Flag, title: "Capital & execution" },
];

const PILLARS = [
  { icon: Search, title: "Problem", text: "Trade data can reveal market gaps, but manufacturers still need to determine whether an opportunity makes sense for their specific business." },
  { icon: FileSearch, title: "Evidence", text: "ForgeNorth starts with product, HS-code, tariff/trade and Canadian import-market information — with verified real data clearly distinguished from manufacturer-provided information, AI-generated analysis and illustrative values." },
  { icon: Sparkles, title: "AI", text: "The AI evaluates each opportunity from multiple perspectives, producing fit scores, confidence levels, supporting insights and visible uncertainty — turning raw market information into manufacturer-specific decision support." },
  { icon: UserCog, title: "Human impact", text: "Instead of manually researching hundreds of potential products: discover, analyze, understand the risks, model the business case, then decide what to investigate next." },
];

function Kicker({ children }: { children: string }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">{children}</div>;
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1 text-muted-foreground md:py-0 md:px-1 md:self-center">
      <ArrowDown className="size-4 md:hidden" />
      <ArrowRight className="hidden size-5 md:block" />
    </div>
  );
}

function Landing() {
  const catalog = Route.useLoaderData();
  const stats = useMemo(() => marketplaceStats(catalog ?? opportunitiesData), [catalog]);
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" aria-label="ForgeNorth home" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center bg-brand-accent text-primary-foreground"><Factory className="size-5" strokeWidth={1.7} /></div>
          <div className="text-[15px] font-bold tracking-tight">FORGE<span className="text-brand-accent">NORTH</span></div>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden text-xs font-semibold text-muted-foreground hover:text-foreground sm:inline">View opportunities</Link>
          <Button asChild size="sm" className="rounded-sm bg-brand-accent text-primary-foreground hover:bg-brand-accent-strong"><Link to="/onboarding">Join the platform</Link></Button>
        </div>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_80%_15%,var(--hero-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <div className="mx-auto inline-flex max-w-full items-center gap-2 border border-border bg-background px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.10em] text-brand-accent sm:text-[11px] sm:tracking-[0.16em]"><Flag className="size-3.5 shrink-0" /> Investing in opportunities during hard times</div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-6xl">Tariffs up. <span className="text-brand-accent">Business up.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">ForgeNorth uses AI to help Canadian manufacturers find and execute on opportunities — connecting you with investors and giving you the platform to build the business plan.</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-sm bg-brand-accent px-7 text-primary-foreground hover:bg-brand-accent-strong"><Link to="/onboarding">Join the platform <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-sm px-7"><Link to="/dashboard">Explore opportunities</Link></Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Free demo · Set up your profile in two minutes</p>
          <div className={"mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden border border-border bg-border text-left " + (stats.estimatedTam != null ? "sm:grid-cols-2" : "")}>
            <div className="bg-background p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Opportunity landscape</div>
              <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl font-semibold text-foreground">{stats.count}</span><span className="text-sm text-muted-foreground">U.S. goods</span></div>
              <p className="mt-1 text-xs text-muted-foreground">On Canada&rsquo;s counter-tariff schedule · {stats.at50} at 50%</p>
            </div>
            {stats.estimatedTam != null && <div className="bg-background p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Est. total U.S. import market</div>
              <div className="mt-1 text-3xl font-semibold text-brand-accent">{shortMoney(stats.estimatedTam)}<span className="text-xs font-normal text-muted-foreground"> / yr</span></div>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Rough estimate: {shortMoney(stats.knownTam)} verified across {stats.withTamCount} goods, scaled to all {stats.count}. Not verified.</p>
            </div>}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-3">
          <div className="border border-border bg-surface p-6">
            <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><Search className="size-5" /></div>
            <h2 className="mt-4 text-lg font-semibold">See the opportunities</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Browse hundreds of goods on Canada's counter-tariff schedule, with verified import market sizes where data is available.</p>
          </div>
          <div className="border border-border bg-surface p-6">
            <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><Sparkles className="size-5" /></div>
            <h2 className="mt-4 text-lg font-semibold">Build your case with AI</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Model the economics, match with funding programs, and generate an investor-ready teaser — all from one workspace.</p>
          </div>
          <div className="border border-border bg-surface p-6">
            <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><LineChart className="size-5" /></div>
            <h2 className="mt-4 text-lg font-semibold">Get seen by investors</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your profile and analysis put your manufacturing opportunity in front of Canadian and U.S. investors looking for the next reshoring play.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>The problem</Kicker>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">A market gap is not yet a business.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">Changing trade conditions can make some imported U.S. products more expensive in Canada, potentially creating import-replacement opportunities. But identifying an import gap is not enough. A Canadian manufacturer still needs to answer: <span className="font-semibold text-foreground">&ldquo;Is this actually a good opportunity for MY factory?&rdquo;</span></p>
          <div className="mt-10 flex flex-col md:flex-row md:items-stretch">
            {PROBLEM_FLOW.map((step, i) => (
              <Fragment key={step.title}>
                <div className={"flex-1 border bg-surface p-5 " + (step.highlight ? "border-brand-accent" : "border-border")}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Step {i + 1}</div>
                  <div className={"mt-2 font-semibold " + (step.highlight ? "text-lg text-brand-accent" : "text-base")}>{step.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </div>
                {i < PROBLEM_FLOW.length - 1 && <FlowArrow />}
              </Fragment>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Built for Canadian manufacturers evaluating adjacent and new production opportunities.</p>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>The ForgeNorth experience</Kicker>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">From 648 opportunities to one informed decision.</h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((step, i) => (
              <div key={step} className="border border-border bg-background p-4">
                <div className={"text-lg font-bold " + (step === "Analyze" || step === "Act" ? "text-brand-accent" : "text-muted-foreground")}>{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-1 text-xs font-semibold uppercase leading-5 tracking-wide">{step}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PERSPECTIVES.map((p) => (
              <div key={p.title} className="border border-border bg-background p-6">
                <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><p.icon className="size-5" /></div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.question}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">After selecting a product, ForgeNorth evaluates it from three perspectives. Each assessment provides:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ASSESSMENT_OUTPUTS.map((o) => (
              <span key={o} className="border border-border bg-background px-3 py-1.5 text-xs font-semibold">{o}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>Under the hood</Kicker>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">AI turns market data into manufacturer-specific insight.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Click Analyze on any product and the assessment runs in three layers — from evidence, through AI reasoning, to decision support.</p>

          <div className="mt-10 border border-border bg-surface p-6 sm:p-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">Layer 1 — Evidence</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {EVIDENCE.map((e) => (
                <div key={e.title} className="border border-border bg-background p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center bg-muted text-brand-accent"><e.icon className="size-4.5" /></div>
                    <h3 className="font-semibold">{e.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                    {e.items.map((item) => <li key={item} className="flex gap-2"><span className="text-brand-accent">+</span>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border border-border bg-surface p-6 sm:p-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">Layer 2 — AI analysis</div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {AI_PIPELINE.map((chip, i) => (
                <Fragment key={chip}>
                  <span className="border border-border bg-background px-3 py-1.5 text-xs font-semibold">{chip}</span>
                  {i < AI_PIPELINE.length - 1 && <ArrowRight className="size-3.5 text-muted-foreground" />}
                </Fragment>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">The AI analyzes the selected opportunity using the available market and product information together with the manufacturer's context. When confidence is low, ForgeNorth exposes where analyses disagree and flags the result for human review — instead of presenting it as certain.</p>
            <figure className="mt-6 border border-border bg-background p-2 sm:p-3">
              <img src={analysisShot} alt="AI assessment page showing fit scores for Product, Investor and Business Health, with a low-confidence question flagged in red for human review" className="w-full" loading="lazy" />
              <figcaption className="px-2 py-3 text-xs leading-5 text-muted-foreground">A live assessment. When the AI analyses disagree — here on &ldquo;Canada as their market?&rdquo; — the question is highlighted in red and every agent's reasoning can be reviewed.</figcaption>
            </figure>
          </div>

          <div className="mt-4 border border-border bg-surface p-6 sm:p-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">Layer 3 — Decision support</div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {DECISION.map((d) => (
                <div key={d.title} className="flex items-center gap-3 border border-border bg-background p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center bg-muted text-brand-accent"><d.icon className="size-4.5" /></div>
                  <span className="text-sm font-semibold leading-5">{d.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border border-brand-accent bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-semibold">Not a black box.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">ForgeNorth does not simply ask an AI &ldquo;should this company manufacture ladders?&rdquo; It combines <span className="font-semibold text-foreground">market evidence + manufacturer context + AI reasoning + confidence and human review</span> to support the decision. And a fit score is exactly that — a fit score, never a probability.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Kicker>Why ForgeNorth matters</Kicker>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">From trade disruption to a manufacturing decision.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.title} className="border border-border bg-background p-6">
                <div className="flex size-10 items-center justify-center bg-muted text-brand-accent"><p.icon className="size-5" /></div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <blockquote className="mt-12 border-l-2 border-brand-accent pl-5 sm:pl-6">
            <p className="max-w-3xl text-xl font-semibold leading-8 sm:text-2xl sm:leading-9">&ldquo;ForgeNorth doesn't just show manufacturers where the market changed. It helps them understand what that change could mean for their business.&rdquo;</p>
          </blockquote>
          <p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground"><span className="font-bold uppercase tracking-[0.14em] text-foreground">Future</span> — As manufacturer profiles and opportunity data grow, ForgeNorth could proactively surface the opportunities most relevant to each factory.</p>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">Ready to make it in Canada?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Create your company profile, explore the opportunity marketplace, and let the AI platform help you build your investment case.</p>
          <Button asChild size="lg" className="mt-8 rounded-sm bg-brand-accent px-8 text-primary-foreground hover:bg-brand-accent-strong"><Link to="/onboarding">Get started <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>
    </main>

    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:px-8">
        <span>FORGE<span className="text-brand-accent">NORTH</span> — Manufacturing intelligence for a stronger Canada.</span>
        <span className="flex flex-wrap items-center gap-4"><Link to="/data-sources" className="font-semibold text-foreground hover:text-brand-accent">Data sources</Link><span>Demonstration platform · Not investment advice.</span></span>
      </div>
    </footer>
  </div>;
}
