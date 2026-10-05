import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, FileText, Factory, MapPin, ShieldCheck, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CERTIFICATIONS, demoProfile, readCompanyProfile, REGIONS, saveCompanyProfile, VERTICALS, type CompanyProfile } from "@/lib/company-profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [
    { title: "Company Profile | ForgeNorth" },
    { name: "description", content: "Create a manufacturing company profile for your ForgeNorth opportunity dashboard." },
    { property: "og:title", content: "Company Profile | ForgeNorth" },
    { property: "og:description", content: "Create a manufacturing company profile for your ForgeNorth opportunity dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Onboarding,
});

function MultiSelect({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (selected: string[]) => void }) {
  return <fieldset>
    <legend className="text-sm font-semibold text-foreground">{label}</legend>
    <div className="mt-3 flex flex-wrap gap-2">{options.map((option) => {
      const active = selected.includes(option);
      return <Button key={option} type="button" variant="outline" aria-pressed={active} onClick={() => onChange(active ? selected.filter((s) => s !== option) : [...selected, option])} className={`h-auto min-h-9 whitespace-normal rounded-sm px-3 py-2 text-left text-xs ${active ? "border-brand-accent bg-alert-soft text-alert hover:bg-alert-soft" : "bg-surface text-muted-foreground"}`}>{active && <Check className="size-3.5" />}{option}</Button>;
    })}</div>
  </fieldset>;
}

function Onboarding() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompanyProfile>(demoProfile);
  const [file, setFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { const stored = readCompanyProfile(); if (stored) setProfile(stored); }, []);
  const update = <K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) => setProfile((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile.verticals.length) { setNotice("Choose at least one industry vertical."); return; }
    setNotice("");
    try {
      saveCompanyProfile({ ...profile, companyName: profile.companyName.trim() });
      void navigate({ to: "/dashboard" });
    } catch { setNotice("We couldn't save the profile in this browser. Please enable browser storage and try again."); }
  };

  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-surface"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"><Link to="/" className="flex items-center gap-3 text-sm font-bold tracking-tight"><span className="flex size-8 items-center justify-center bg-brand-accent text-primary-foreground"><Factory className="size-4" /></span>FORGE<span className="text-brand-accent">NORTH</span></Link><Link to="/dashboard" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to dashboard</Link></div></header>
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-14">
      <aside className="lg:sticky lg:top-10 lg:self-start"><div className="section-kicker">COMPANY PROFILE / DEMO</div><h1 className="mt-3 text-3xl font-semibold leading-tight">Tell us what you make.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Build your manufacturing profile before exploring the opportunity dashboard.</p><div className="mt-7 border-l-2 border-brand-accent pl-4 text-xs leading-5 text-muted-foreground">These example details are fictional. Replace them with your own information before using the profile.</div></aside>
      <form onSubmit={submit} className="min-w-0 space-y-10">
        <section className="border-b border-border pb-9"><div className="flex items-center gap-2 text-brand-accent"><Building2 className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">01 / Company</span></div><h2 className="mt-3 text-xl font-semibold">Company identity</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Company name <span className="text-brand-accent">*</span><Input required maxLength={120} value={profile.companyName} onChange={(e) => update("companyName", e.target.value)} className="mt-2 h-11 rounded-sm bg-surface font-normal" /></label><label className="block text-sm font-semibold">Region <span className="text-brand-accent">*</span><select required value={profile.region} onChange={(e) => update("region", e.target.value)} className="mt-2 h-11 w-full rounded-sm border border-input bg-surface px-3 text-sm font-normal"><option value="">Select province or territory</option>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></label><label className="block text-sm font-semibold sm:col-span-2"><span className="flex items-center gap-1"><MapPin className="size-4 text-muted-foreground" /> City or community</span><Input value={profile.city} onChange={(e) => update("city", e.target.value)} maxLength={100} className="mt-2 h-11 rounded-sm bg-surface font-normal" /></label></div></section>
        <section className="border-b border-border pb-9"><div className="flex items-center gap-2 text-brand-accent"><Factory className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">02 / Operations</span></div><h2 className="mt-3 text-xl font-semibold">What your team can deliver</h2><div className="mt-6 space-y-7"><MultiSelect label="Industry verticals *" options={VERTICALS} selected={profile.verticals} onChange={(value) => update("verticals", value)} /><label className="block text-sm font-semibold">Manufacturing capabilities <span className="text-brand-accent">*</span><Textarea required rows={3} value={profile.capabilities} onChange={(e) => update("capabilities", e.target.value)} placeholder="Processes, materials, production scale and specialties" className="mt-2 rounded-sm bg-surface font-normal" /></label><label className="block text-sm font-semibold">Equipment & software installed <span className="text-brand-accent">*</span><Textarea required rows={3} value={profile.equipmentSoftware} onChange={(e) => update("equipmentSoftware", e.target.value)} placeholder="Machines, automation, CAD/CAM, ERP or MES" className="mt-2 rounded-sm bg-surface font-normal" /></label><label className="block text-sm font-semibold">Technical & trade skills <span className="text-brand-accent">*</span><Textarea required rows={3} value={profile.labourSkills} onChange={(e) => update("labourSkills", e.target.value)} placeholder="Trades, engineering and quality skills on your team" className="mt-2 rounded-sm bg-surface font-normal" /></label></div></section>
        <section className="border-b border-border pb-9"><div className="flex items-center gap-2 text-brand-accent"><ShieldCheck className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">03 / Credentials</span></div><h2 className="mt-3 text-xl font-semibold">Manufacturing certifications</h2><div className="mt-6 space-y-5"><MultiSelect label="Select all that apply" options={CERTIFICATIONS} selected={profile.certifications} onChange={(value) => update("certifications", value)} /><label className="block text-sm font-semibold">Other certifications <span className="font-normal text-muted-foreground">(optional)</span><Input value={profile.otherCertifications} onChange={(e) => update("otherCertifications", e.target.value)} placeholder="Add other applicable standards" className="mt-2 h-11 rounded-sm bg-surface font-normal" /></label></div></section>
        <section className="pb-2"><div className="flex items-center gap-2 text-brand-accent"><FileText className="size-5" /><span className="text-xs font-bold uppercase tracking-widest">04 / Financial documents</span></div><h2 className="mt-3 text-xl font-semibold">Balance sheet / financial statements <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2><p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">Private documents are not uploaded or saved in this demo. You can select a file for now, but it will not be attached to your profile.</p><div className="mt-5 flex flex-wrap items-center gap-3"><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-sm border border-input bg-surface px-4 text-sm font-medium hover:bg-muted"><Upload className="size-4" /> Choose file<input type="file" accept=".pdf,.csv,.xlsx,.xls" className="sr-only" onChange={(e) => { const next = e.target.files?.[0] ?? null; setFile(next); }} /></label>{file && <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><span className="max-w-56 truncate">{file.name}</span><Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Remove selected file" onClick={() => { setFile(null); const input = document.querySelector<HTMLInputElement>('input[type="file"]'); if (input) input.value = ""; }}><X className="size-3.5" /></Button></span>}</div></section>
        {notice && <p role="alert" className="text-sm font-medium text-alert">{notice}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"><p className="text-xs text-muted-foreground">Profile details are saved in this browser only.</p><Button type="submit" size="lg" className="rounded-sm bg-brand-accent px-6 text-primary-foreground hover:bg-brand-accent-strong">Save profile & open dashboard <ArrowRight className="size-4" /></Button></div>
      </form>
    </main>
  </div>;
}
