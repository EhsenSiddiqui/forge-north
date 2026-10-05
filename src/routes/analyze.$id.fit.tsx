import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { FitResults } from "@/components/fit-results";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const parent = getRouteApi("/analyze/$id");

export const Route = createFileRoute("/analyze/$id/fit")({
  component: FitStep,
});

function FitStep() {
  const item = parent.useLoaderData();
  return <section>
    <FitResults />
    <div className="mt-6 flex justify-end">
      <Link to="/analyze/$id/market" params={{ id: item.id }} className="flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold hover:border-brand-accent hover:text-brand-accent">Next: Market intelligence <ArrowRight className="size-3.5" /></Link>
    </div>
  </section>;
}
