import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Compass, FileSearch, Handshake, Send, Sparkles } from "lucide-react";
import type { Opportunity } from "@/lib/opportunities";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/act")({
  component: ActStep,
});

const AGENT_TASKS = [
  {
    icon: Compass,
    title: "Build your perspective",
    body: "Turns this analysis into a Product, Investor and Business Health point of view — sharpened by your equipment, certifications and region, not a generic template.",
    output: "A one-page perspective you can send.",
  },
  {
    icon: FileSearch,
    title: "Gather what's missing",
    body: "Chases the items still marked pending: tariff classification, supplier quotes, program eligibility, verified production and emissions figures.",
    output: "An evidence pack with every source cited.",
  },
  {
    icon: Handshake,
    title: "Make the introductions",
    body: "Drafts and sends tailored briefs to investors, joint-venture partners and consultants whose mandate matches this product — then tracks who replies.",
    output: "A live outreach list with responses.",
  },
] as const;

function ActStep() {
  const item = parent.useLoaderData();
  const [started, setStarted] = useState(false);

  return <section>
    <div className="section-kicker mb-3">06 / PUT IT TO WORK</div>

    <div className="relative overflow-hidden border border-brand-accent/25 bg-brand-accent-soft p-6 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">
          Hand the next 90 days to <span className="text-brand-accent">ForgeNorth</span>.
        </h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          You've assessed the opportunity. Now let the platform work for you: it builds the perspective,
          gathers the evidence investors will ask for, and reaches out to investors, partners and consultants
          on your behalf for <span className="font-semibold text-foreground">{item.name}</span>.
        </p>
      </div>

      <ul className="relative mt-8 grid gap-4 lg:grid-cols-3">
        {AGENT_TASKS.map((task) => <li key={task.title} className="border border-border bg-surface p-5">
          <task.icon className="size-5 text-brand-accent" />
          <h3 className="mt-3 text-sm font-semibold">{task.title}</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{task.body}</p>
          <div className="mt-4 border-t border-border pt-3 text-xs font-semibold text-foreground">{task.output}</div>
        </li>)}
      </ul>

      <div className="relative mt-8 flex flex-wrap items-center gap-5">
        {started ? <div className="w-full border border-success/30 bg-success-soft p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="size-5" /> You're in the queue.</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            This is a demonstration build — the agent hasn't contacted anyone yet. When it goes live, it will
            prepare the perspective, the evidence pack and the outreach list for <span className="font-semibold text-foreground">{item.name}</span>,
            and you approve every message before it leaves.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/analyze/$id/fit" params={{ id: item.id }} className="border border-border bg-surface px-3.5 py-2 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Review the fit assessment</Link>
            <Link to="/dashboard" className="border border-border bg-surface px-3.5 py-2 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Back to dashboard</Link>
          </div>
        </div> : <>
          <button type="button" onClick={() => setStarted(true)} className="group inline-flex items-center gap-2.5 bg-brand-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-accent-foreground shadow-sm transition-colors hover:bg-brand-accent-strong sm:text-base">
            <Sparkles className="size-4" />
            Put ForgeNorth to work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-xs text-muted-foreground">No commitments. You approve every outreach before it goes out.</span>
        </>}
      </div>

      <div className="relative mt-6 flex items-start gap-2 border-t border-brand-accent/20 pt-4 text-xs text-muted-foreground">
        <Send className="mt-0.5 size-3.5 shrink-0 text-brand-accent" />
        <span>Illustrative demo: the outreach list on this page is sample data, and no investor, partner or consultant has been contacted.</span>
      </div>
    </div>
  </section>;
}
