import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { MarketIntelligence } from "@/components/analysis-report";
import { ArrowRight } from "lucide-react";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/market")({
  component: MarketStep,
});

function MarketStep() {
  const item = parent.useLoaderData();
  return <section>
    <MarketIntelligence item={item} />
    <div className="mt-6 flex justify-end">
      <Link to="/analyze/$id/finance" params={{ id: item.id }} className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Next: Financial engine <ArrowRight className="size-3.5" /></Link>
    </div>
  </section>;
}
