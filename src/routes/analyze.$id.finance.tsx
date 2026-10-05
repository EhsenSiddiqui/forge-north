import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { FinancialEngine } from "@/components/analysis-report";
import { ArrowRight } from "lucide-react";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/finance")({
  component: FinanceStep,
});

function FinanceStep() {
  const item = parent.useLoaderData();
  return <section>
    <FinancialEngine item={item} mode="manufacturer" />
    <div className="mt-6 flex justify-end">
      <Link to="/analyze/$id/capital" params={{ id: item.id }} className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Next: Capital & execution <ArrowRight className="size-3.5" /></Link>
    </div>
  </section>;
}
