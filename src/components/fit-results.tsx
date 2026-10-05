import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import data from "@/data/fit-results.json";

type Opinion = { agent: string; answer: string; reason: string };
type Question = { q: string; answer: string; fit: number; confidence: string; insights: string[]; agent_opinions?: Opinion[] };
type Area = { score: number; name?: string; questions: Question[] };
type Product = { name: string; score_with_tariff: number; score_without_tariff: number; areas: Record<"product" | "investor" | "business_health", Area> };
const results = data as { factory: string; products: Product[] };

const risk = (s: number) => s >= 75 ? { label: "Low risk", cls: "bg-success-soft text-success border-success" }
  : s >= 50 ? { label: "Medium risk", cls: "bg-warning-soft text-warning border-warning" }
  : { label: "High risk", cls: "bg-alert-soft text-alert border-alert" };
const conf: Record<string, string> = {
  High: "bg-success-soft text-success border-success",
  Medium: "bg-warning-soft text-warning border-warning",
  Low: "bg-alert-soft text-alert border-alert",
};

function QuestionCard({ q }: { q: Question }) {
  const [open, setOpen] = useState(false);
  const low = q.confidence === "Low";
  return <div className={`border bg-surface p-4 ${low ? "border-2 border-alert" : "border-border"}`}>
    <p className="text-sm font-semibold leading-5">{q.q}</p>
    <div className="mt-2.5 flex flex-wrap items-center gap-2">
      <span className="text-base font-semibold leading-5">{q.answer}</span>
      <span className="text-xs text-muted-foreground">Fit score {q.fit}%</span>
      <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-semibold leading-4 ${conf[q.confidence] ?? ""}`}>{low && <AlertTriangle className="size-3" />}{q.confidence} confidence</span>
    </div>
    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-5 text-muted-foreground">{q.insights.map((i) => <li key={i}>{i}</li>)}</ul>
    {low && q.agent_opinions && <div className="mt-3 border-t border-border pt-3">
      <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs font-semibold text-alert">
        See why agents disagreed <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-2.5 space-y-2">{q.agent_opinions.map((o) => <div key={o.agent} className="bg-muted p-2.5 text-xs leading-5">
        <p className="font-semibold text-foreground">{o.agent}: {o.answer}</p><p className="text-muted-foreground">{o.reason}</p>
      </div>)}</div>}
    </div>}
  </div>;
}

function Column({ title, area, extra }: { title: string; area: Area; extra?: string }) {
  const r = risk(area.score);
  return <section className="flex flex-col gap-3">
    <div className="border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {area.name && <p className="mt-1 text-xs text-muted-foreground">{area.name}</p>}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-semibold leading-none tabular-nums">{area.score}%</span>
        <span className={`mb-0.5 border px-1.5 py-0.5 text-[10px] font-semibold leading-4 ${r.cls}`}>{r.label}</span>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Fit score{extra ? ` · ${extra}` : ""}</p>
    </div>
    {area.questions.map((q) => <QuestionCard key={q.q} q={q} />)}
  </section>;
}

export function FitResults() {
  const [idx, setIdx] = useState(0);
  const p = results.products[idx] ?? results.products[0]!;
  return <section>
    <div className="flex flex-wrap items-center gap-2"><div className="section-kicker">01 / FIT ASSESSMENT</div><span className="border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Demo data</span></div>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {results.products.length > 1
        ? <select value={idx} onChange={(e) => setIdx(Number(e.target.value))} className="border border-border bg-surface px-2.5 py-1.5 text-sm font-semibold">{results.products.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}</select>
        : <h2 className="text-xl font-semibold">{p.name}</h2>}
      <span className="text-xs text-muted-foreground">With tariff: <b className="font-semibold text-foreground">{p.score_with_tariff}%</b> | If tariff removed: <b className="font-semibold text-foreground">{p.score_without_tariff}%</b></span>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <Column title="Product" area={p.areas.product} extra={`If tariff removed: ${p.score_without_tariff}%`} />
      <Column title="Investor" area={p.areas.investor} />
      <Column title="Your Business Health" area={p.areas.business_health} />
    </div>
  </section>;
}
