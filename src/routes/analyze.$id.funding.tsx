import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NextStepsSection } from "@/components/analysis-report";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/funding")({
  component: FundingStep,
});

function FundingStep() {
  const item = parent.useLoaderData();
  return <section>
    <div className="section-kicker mb-3">05 / FUNDING, INVESTORS & NEXT STEPS</div>
    <div className="border border-border bg-surface p-5 sm:p-7"><NextStepsSection item={item} /></div>
    <div className="mt-6 flex justify-end">
      <Link to="/analyze/$id/act" params={{ id: item.id }} className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Next: Put it to work <ArrowRight className="size-3.5" /></Link>
    </div>
  </section>;
}
