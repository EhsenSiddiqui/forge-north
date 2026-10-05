import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { CapitalExecution } from "@/components/analysis-report";
import { ArrowRight } from "lucide-react";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/capital")({
  component: CapitalStep,
});

function CapitalStep() {
  const item = parent.useLoaderData();
  return <section>
    <CapitalExecution item={item} />
    <div className="mt-6 flex justify-end">
      <Link to="/analyze/$id/funding" params={{ id: item.id }} className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Next: Funding & investors <ArrowRight className="size-3.5" /></Link>
    </div>
  </section>;
}
