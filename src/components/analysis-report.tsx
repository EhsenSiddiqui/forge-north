import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getHsDetails } from "@/lib/catalog.functions";
import { ArrowRight, ArrowUpRight, Building2, Download, Factory, FileText, Handshake, Landmark, Leaf, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateFinancials, type Opportunity } from "@/lib/opportunities";
import { Input } from "@/components/ui/input";

const money = (value: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);
const shortMoney = (value: number | null) => value == null ? "Pending" : value >= 1_000_000_000 ? `$${(value / 1_000_000_000).toFixed(1)}B` : `$${Math.round(value / 1_000_000)}M`;
const optMoney = (value: number | null) => value == null ? "Pending" : money(value);

export function MarketIntelligence({ item }: { item: Opportunity }) {
  return <div className="border border-border bg-surface p-5 sm:p-7">
    <div className="section-kicker">02 / MARKET INTELLIGENCE</div>
    <h3 className="mt-3 text-xl font-semibold">The import gap</h3>
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <div>
        <div className="border-b border-border pb-6"><div className="text-xs text-muted-foreground">Canadian import market · annual</div><div className="mt-1 text-sm text-muted-foreground">{item.description}</div><div className="mt-3 text-4xl font-semibold">{shortMoney(item.tam)} <span className="text-base font-normal text-muted-foreground">CAD</span></div><div className="mt-3 inline-flex border border-alert/20 bg-alert-soft px-2.5 py-1.5 text-xs font-semibold text-alert"><ShieldAlert className="mr-1.5 size-3.5" /> +{item.tariff}% U.S. counter-tariff surtax</div></div>
        <div className="mt-6 border-l-2 border-alert bg-alert-soft p-4"><h4 className="text-sm font-semibold">Tariff price umbrella</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">A surtax on applicable U.S. imports could create pricing room for locally made goods. Actual landed cost and tariff applicability depend on classification, origin, exemptions, and current policy.</p></div>
      </div>
      <div>
        <div><div className="flex items-center gap-2 text-sm font-semibold"><Leaf className="size-4 text-success" /> Alternative sourcing</div>{item.sourcing.length === 0 && <p className="mt-3 text-xs text-muted-foreground">Sourcing options not yet researched for this item.</p>}<ul className="mt-4 space-y-3">{item.sourcing.map((source) => <li key={source} className="flex gap-2.5 text-xs leading-5 text-muted-foreground"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />{source}</li>)}</ul></div>
        <div className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground"><span className="font-medium text-foreground">Potential production hubs</span><br />{item.location || "To be identified"}</div>
        <div className="mt-6 border-t border-border pt-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold"><Leaf className="size-4 text-success" /> CO₂ emissions impact</h4>
          <div className="mt-3 text-xl font-semibold text-foreground">Pending assessment</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">The change in emissions from replacing U.S. imports with Canadian production is not yet known. Compare transportation and manufacturing emissions for both supply chains, using verified production volumes and locations, before estimating CO₂e saved or added.</p>
        </div>
      </div>
    </div>
  </div>;
}

export function FinancialEngine({ item, mode }: { item: Opportunity; mode: "manufacturer" | "investor" }) {
  const [share, setShare] = useState(10);
  const [gtm, setGtm] = useState(250_000);
  const [acquisition, setAcquisition] = useState(0);
  const [grant, setGrant] = useState(35);
  const [tam, setTam] = useState<number | null>(item?.tam ?? null);
  const [capex, setCapex] = useState<number | null>(item?.capex ?? null);
  const [margin, setMargin] = useState<number | null>(item?.margin ?? null);
  const financials = calculateFinancials({ tam, capex, margin }, share, gtm, acquisition, grant);
  const missing = tam == null || capex == null || margin == null;

  return <div className="border border-border bg-surface p-5 sm:p-7">
    <div className="section-kicker">03 / FINANCIAL ENGINE</div>
    <div className="mt-3 flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-xl font-semibold">Model the opportunity</h3><p className="mt-1 text-xs text-muted-foreground">Adjust assumptions to see the scenario change.</p></div><span className="border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{mode === "manufacturer" ? "Retool scenario" : "Investment scenario"}</span></div>
    <div className="mt-6 grid gap-3 border border-border bg-background p-4 sm:grid-cols-3"><div className="sm:col-span-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Market inputs {missing && <span className="ml-1 font-medium normal-case tracking-normal text-alert">· enter values to run the model</span>}</div><NumberField label="Import market (CAD/yr)" value={tam} onChange={setTam} /><NumberField label="Retool CapEx (CAD)" value={capex} onChange={setCapex} /><NumberField label="Gross margin (%)" value={margin} onChange={setMargin} /></div>
    <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2"><ModelSlider label="Market share target" value={share} min={1} max={35} step={1} display={`${share}%`} onChange={setShare} minLabel="1%" maxLabel="35%" /><ModelSlider label="Go-to-market budget" value={gtm} min={50_000} max={1_000_000} step={10_000} display={money(gtm)} onChange={setGtm} minLabel="$50K" maxLabel="$1M" /><ModelSlider label="Plant acquisition / M&A" value={acquisition} min={0} max={5_000_000} step={50_000} display={acquisition === 0 ? "$0 · Line retool" : money(acquisition)} onChange={setAcquisition} minLabel="$0 · Retool" maxLabel="$5M · Buy" /><ModelSlider label="Grant & incentive offset" value={grant} min={0} max={50} step={1} display={`${grant}%`} onChange={setGrant} minLabel="0%" maxLabel="50%" /></div>
    <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4"><Metric label="Target revenue" value={money(financials.targetRevenue)} note="CAD / year" /><Metric label="Net required capital" value={money(financials.netCapital)} note="After assumed offset" highlight /><Metric label="Incentive capital saved" value={money(financials.incentiveSaved)} note="Illustrative RTRI + OMMITC stack" /><Metric label="Est. payback horizon" value={`${financials.paybackMonths} mo`} note="Gross-profit basis" /></div>
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground"><span>Annual gross profit <strong className="text-foreground">{money(financials.annualGrossProfit)}</strong></span><span>Gross investment <strong className="text-foreground">{money(financials.grossInvestment)}</strong></span></div>
    <p className="mt-4 text-[11px] leading-5 text-muted-foreground">Payback = net capital ÷ annual gross profit × 12, rounded. It does not account for operating expenses, taxes, ramp-up, financing, or cash flow. Grant offset is an assumption, not an award.</p>
  </div>;
}

export function CapitalExecution({ item }: { item: Opportunity }) {
  const tam = item.tam ?? null;
  const capex = item.capex ?? null;
  const margin = item.margin ?? null;
  const financials = calculateFinancials({ tam, capex, margin }, 10, 250_000, 0, 35);

  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    pdf.setFillColor(15, 23, 42); pdf.rect(0, 0, 210, 43, "F");
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(11); pdf.text("FORGENORTH  /  OPPORTUNITY ENGINE", 15, 18);
    pdf.setFontSize(18); pdf.text("Investor opportunity teaser", 15, 31);
    pdf.setTextColor(15, 23, 42); pdf.setFontSize(17);
    pdf.text(pdf.splitTextToSize(item.name, 180), 15, 58);
    pdf.setFontSize(10); pdf.setTextColor(90, 105, 120); pdf.text(`HS ${item.hsCode}  |  ${item.sector}${item.location ? `  |  ${item.location}` : ""}`, 15, 75);
    pdf.setDrawColor(220, 225, 230); pdf.line(15, 83, 195, 83);
    const rows = [
      ["Annual Canadian import market", optMoney(tam)], ["U.S. counter-tariff surtax", `${item.tariff}%`],
      ["Target market share", "10%"], ["Target annual revenue", money(financials.targetRevenue)],
      ["Industry average gross margin", margin == null ? "Pending" : `${margin}%`], ["Annual gross profit", money(financials.annualGrossProfit)],
      ["Gross upfront investment", money(financials.grossInvestment)], ["Assumed incentive offset", `35% / ${money(financials.incentiveSaved)}`],
      ["Net required capital", money(financials.netCapital)], ["Estimated payback", `${financials.paybackMonths} months`],
    ];
    pdf.setFontSize(10); rows.forEach(([label, value], index) => { const y = 94 + index * 15; pdf.setTextColor(90, 105, 120); pdf.text(label ?? "", 15, y); pdf.setTextColor(15, 23, 42); pdf.text(value ?? "", 195, y, { align: "right" }); pdf.setDrawColor(236, 239, 242); pdf.line(15, y + 4, 195, y + 4); });
    pdf.setFontSize(9); pdf.setTextColor(100, 110, 120); pdf.text(pdf.splitTextToSize("Illustrative POC only. Figures, tariff applicability and funding availability are unverified. Payback uses annual gross profit, not net cash flow. Conduct independent diligence before investment.", 180), 15, 257);
    pdf.save(`forgenorth-${item.id}-teaser.pdf`);
  };
  const exportDraft = () => {
    const text = `GOVERNMENT GRANT APPLICATION DRAFT — ILLUSTRATIVE ONLY\n\nProject: ${item.name}\nHS code: ${item.hsCode}\nSector: ${item.sector}\nProposed Canadian production region: ${item.location}\n\nPROJECT OVERVIEW\n${item.description} This proposal explores domestic manufacturing capacity to address an illustrative ${optMoney(tam)} annual Canadian import market.\n\nPROPOSED INVESTMENT\nBase retool capital: ${optMoney(capex)}\nGo-to-market budget: ${money(250_000)}\nPlant acquisition budget: ${money(0)}\nGross upfront investment: ${money(financials.grossInvestment)}\nAssumed incentive offset (35%): ${money(financials.incentiveSaved)}\nNet required capital: ${money(financials.netCapital)}\n\nPOTENTIAL SOURCING\n${item.sourcing.map((s) => `- ${s}`).join("\n")}\n\nPOTENTIAL PROGRAMS TO INVESTIGATE\n- Regional Tariff Response Initiative (RTRI)\n- Ontario Made Manufacturing Investment Tax Credit (OMMITC; Ontario eligibility only)\n\nNEXT STEPS\nConfirm tariff classification and current rates; verify program terms, eligibility, stacking rules, eligible costs, matching funding, and application deadlines with official program administrators. Add company details, jobs created, project schedule, supplier letters, and supporting quotations.\n\nDISCLAIMER\nThis is a generated planning draft, not an application or confirmation of eligibility. All market figures and assumptions are illustrative.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `forgenorth-${item.id}-grant-draft.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="border border-border bg-surface p-5 sm:p-7">
    <div className="section-kicker">04 / CAPITAL & EXECUTION</div>
    <h3 className="mt-3 text-xl font-semibold">Build the capital stack</h3>
    <p className="mt-1 text-xs leading-5 text-muted-foreground">Programs and partners to investigate; no eligibility or availability is confirmed.</p>
    <div className="grid gap-10 lg:grid-cols-2">
      <HsLinkedInfo hsCode={item.hsCode} sector={item.sector} />
      <div>
        <div className="mt-7 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Documents</div>
        <div className="mt-3 space-y-2">
          <Button className="h-auto min-h-11 w-full justify-between whitespace-normal rounded-sm py-2 text-left text-xs" onClick={exportPdf}><span className="flex items-center gap-2"><Download className="size-4" /> Export investor teaser (PDF)</span><ArrowRight className="size-4" /></Button>
          <Button variant="outline" className="h-auto min-h-11 w-full justify-between whitespace-normal rounded-sm py-2 text-left text-xs" onClick={exportDraft}><span className="flex items-center gap-2"><FileText className="size-4" /> Generate grant draft (.txt)</span><ArrowRight className="size-4" /></Button>
        </div>
        <p className="mt-4 text-[11px] leading-5 text-muted-foreground">Drafts are saved to your device. Review and verify all figures and program terms before sharing. Exports use the default scenario assumptions (10% share, $250K go-to-market, 35% incentive offset).</p>
      </div>
    </div>
  </div>;
}

function ModelSlider({ label, value, min, max, step, display, onChange, minLabel, maxLabel }: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (value: number) => void; minLabel: string; maxLabel: string }) {
  return <div><div className="flex min-h-9 items-start justify-between gap-2 text-xs"><label htmlFor={`slider-${label}`} className="font-medium leading-4">{label}</label><span className="shrink-0 font-semibold tabular-nums text-foreground">{display}</span></div><input id={`slider-${label}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="model-range mt-2 w-full" style={{ "--range-fill": `${(value - min) / (max - min) * 100}%` } as React.CSSProperties} /><div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{minLabel}</span><span>{maxLabel}</span></div></div>;
}
function Metric({ label, value, note, highlight = false }: { label: string; value: string; note: string; highlight?: boolean }) {
  return <div className={`min-w-0 border p-3.5 sm:p-4 ${highlight ? "border-success/30 bg-success-soft" : "border-border bg-background"}`}><div className="text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-muted-foreground">{label}</div><div className={`mt-2 break-words text-lg font-semibold tabular-nums sm:text-xl ${highlight ? "text-success" : "text-foreground"}`}>{value}</div><div className="mt-1 text-[10px] leading-4 text-muted-foreground">{note}</div></div>;
}
function PartnerCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="flex gap-3 border border-border bg-background p-3"><div className="flex size-8 shrink-0 items-center justify-center bg-muted text-primary [&_svg]:size-4">{icon}</div><div><div className="text-xs font-semibold leading-4">{title}</div><div className="mt-1 text-[11px] leading-4 text-muted-foreground">{subtitle}</div></div></div>;
}
function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return <label className="block text-xs"><span className="font-medium">{label}</span><Input type="number" min={0} inputMode="decimal" value={value ?? ""} placeholder="Pending" onChange={(e) => onChange(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))} className="mt-1.5 h-9 rounded-sm bg-surface" /></label>;
}

function HsLinkedInfo({ hsCode, sector }: { hsCode: string; sector: string }) {
  const fetchDetails = useServerFn(getHsDetails);
  const { data, isLoading, error } = useQuery({ queryKey: ["hs-details", hsCode], queryFn: () => fetchDetails({ data: { hsCode, sector } }) });
  const heading = (t: string) => <div className="mt-7 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t}</div>;
  if (isLoading) return <p className="mt-7 text-xs text-muted-foreground">Loading data for HS {hsCode}…</p>;
  if (error || !data) return <p className="mt-7 text-xs text-alert">Could not load linked data for HS {hsCode}.</p>;
  const pct = (n: number | null) => n == null ? "" : ` · up to ${n}%`;
  return <div>
    {data.market?.source && <p className="mt-5 text-[11px] text-muted-foreground">Import data: {data.market.source}{data.market.data_year ? ` (${data.market.data_year})` : ""}</p>}
    {heading("Funding programs")}
    <div className="mt-3 space-y-2.5">{data.funding.length ? data.funding.map((f) => <PartnerCard key={f.name} icon={<Landmark />} title={f.name} subtitle={[f.provider, f.program_type].filter(Boolean).join(" · ") + pct(f.max_pct)} />) : <p className="text-xs text-muted-foreground">No programs linked to this code yet — pending your upload.</p>}</div>
    {heading("Canadian suppliers")}
    <div className="mt-3 space-y-2.5">{data.suppliers.length ? data.suppliers.map((s) => <PartnerCard key={s.name} icon={<Factory />} title={s.name} subtitle={[s.supplier_type, s.city, s.province].filter(Boolean).join(" · ")} />) : <p className="text-xs text-muted-foreground">No suppliers linked to this code yet — pending your upload.</p>}</div>
  </div>;
}

type NextStepLink = { name: string; detail: string; url: string };
const NEXT_STEP_GROUPS: { title: string; icon: React.ReactNode; links: NextStepLink[] }[] = [
  {
    title: "Government funding programs",
    icon: <Landmark />,
    links: [
      { name: "Regional Tariff Response Initiative (RTRI)", detail: "Federal · up to 35% of eligible costs for tariff-impacted manufacturers", url: "https://www.canada.ca/en/innovation-science-economic-development.html" },
      { name: "Ontario Made Manufacturing Investment Tax Credit", detail: "Ontario · 10% refundable credit on buildings, machinery, equipment", url: "https://www.ontario.ca/page/ontario-made-manufacturing-investment-tax-credit" },
      { name: "Strategic Innovation Fund (SIF)", detail: "Federal · large-scale industrial transformation projects", url: "https://ised-isde.canada.ca/site/strategic-innovation-fund/en" },
      { name: "SR&ED tax incentives", detail: "Federal · R&D tax credits for process and product development", url: "https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program.html" },
      { name: "BDC — Manufacturing financing", detail: "Crown corp · loans and advisory for Canadian manufacturers", url: "https://www.bdc.ca/en/i-am/manufacturing" },
    ],
  },
  {
    title: "Consultants & advisors",
    icon: <Users />,
    links: [
      { name: "Customs broker / trade consultant", detail: "Confirm HS classification, surtax exposure and origin rules before quoting", url: "https://www.cbsa-asfc.gc.ca/services/cb-cd/cb-cd-eng.html" },
      { name: "Grant writing consultant", detail: "Prepares RTRI / SIF / OMMITC applications and stacking strategy", url: "https://www.canada.ca/en/services/business/grants.html" },
      { name: "NRC Industrial Research Assistance Program (IRAP)", detail: "Advisory services and funding for technology adoption projects", url: "https://nrc.canada.ca/en/support-technology-innovation" },
    ],
  },
  {
    title: "Canadian joint-venture partners",
    icon: <Handshake />,
    links: [
      { name: "Canadian Manufacturers & Exporters (CME)", detail: "National network to find established Canadian producers open to co-manufacturing or JV", url: "https://cme-mec.ca/" },
      { name: "NGen — Canada's Advanced Manufacturing Supercluster", detail: "Co-invests in collaborative manufacturing projects between Canadian partners", url: "https://www.ngen.ca/" },
      { name: "Ontario Vehicle Innovation Network (OVIN)", detail: "Ontario · partners and pilots for automotive and mobility production JVs", url: "https://www.ovinhub.ca/" },
      { name: "Invest in Canada", detail: "Federal · connects projects with Canadian industrial partners and sites", url: "https://www.investcanada.ca/" },
    ],
  },
  {
    title: "Canadian investors",
    icon: <Factory />,
    links: [
      { name: "BDC Capital — Industrial Innovation Venture Fund", detail: "CA · deep-tech and industrial transformation ventures", url: "https://www.bdc.ca/en/bdc-capital" },
      { name: "MaRS Investment Accelerator Fund", detail: "CA · Ontario early-stage co-investment", url: "https://www.marsdd.com/" },
      { name: "Export Development Canada (EDC)", detail: "CA · trade financing and investor connections", url: "https://www.edc.ca/" },
    ],
  },
  {
    title: "U.S. investors",
    icon: <Building2 />,
    links: [
      { name: "Lux Capital", detail: "US · industrial and hard-tech venture capital", url: "https://www.luxcapital.com/" },
      { name: "Eclipse Ventures", detail: "US · industrial and manufacturing transformation", url: "https://eclipse.vc/" },
      { name: "DCVC", detail: "US · deep-tech and industrial automation", url: "https://www.dcvc.com/" },
    ],
  },
];
const NEXT_STEP_ACTIONS = [
  "Confirm HS classification and current surtax rate with a customs broker before quoting the tariff advantage.",
  "Verify program eligibility, stacking rules, and deadlines with each program administrator.",
  "Prepare a one-page teaser (use the PDF export above) before approaching investors.",
  "Line up supplier letters and equipment quotations to support grant applications.",
];
export function NextStepsSection({ item }: { item: Opportunity }) {
  return <div className="space-y-5">
    <div className="border border-alert/30 bg-alert-soft p-3 text-[11px] leading-4 text-muted-foreground"><span className="font-semibold text-alert">Illustrative demo data.</span> These investor and program matches are sample suggestions for this {item.sector.toLowerCase()} opportunity — not verified recommendations or endorsements. Links go to official organization sites.</div>
    <div className="grid gap-6 sm:grid-cols-2">
      {NEXT_STEP_GROUPS.map((group) => <div key={group.title}>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground"><span className="text-primary [&_svg]:size-3.5">{group.icon}</span>{group.title}</div>
        <div className="mt-2.5 space-y-2">{group.links.map((link) => <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 border border-border bg-background p-3 transition-colors hover:border-primary/40">
          <span><span className="block text-xs font-semibold leading-4 text-foreground">{link.name}</span><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{link.detail}</span></span>
          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
        </a>)}</div>
      </div>)}
    </div>
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Actionable next steps</div>
      <ol className="mt-2.5 space-y-2">{NEXT_STEP_ACTIONS.map((action, i) => <li key={action} className="flex gap-2.5 text-xs leading-5 text-muted-foreground"><span className="flex size-5 shrink-0 items-center justify-center border border-border bg-background text-[10px] font-semibold text-foreground">{i + 1}</span>{action}</li>)}</ol>
    </div>
  </div>;
}
