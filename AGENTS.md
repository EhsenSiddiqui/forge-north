<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep illustrative opportunity inputs and the financial formula in `src/lib/opportunities.ts` so the marketplace, exports, and tests share one source of truth.
- Generate investor PDFs in the browser and grant drafts as local downloads because this proof of concept has no verified live funding or trade data service.
- The marketplace is read from the database, where every table links to tariff_items by HS code; missing market, economics, supplier and funding data stays null (shown as pending) so no unverified number appears as fact. Data changes arrive as user-uploaded spreadsheets loaded by the agent, so tables are public read-only.
- Demo company onboarding persists non-financial profile fields in browser storage only; financial statement files stay in memory and are never uploaded, because this proof of concept has no authenticated private document storage.
- Opportunity analysis is a six-step workspace under /analyze/$id (no dialog), each step its own route: fit, market, finance, capital, funding, act. The company profile and the step nav (solid brand-red active, pale red + check completed, white/grey upcoming) stay on every step; fit scores come from src/data/fit-results.json so live agent output can replace them without page changes.
- The final step is an invitation to let the platform run the work (build the perspective, gather pending evidence, reach out to investors/partners/consultants); it is a labelled demo — the button records interest locally and contacts no one, because no agent outreach service is wired up.
- Route layout: `/` is the marketing landing page (CTA → onboarding); the opportunity marketplace lives at `/dashboard`; onboarding saves the profile and navigates to `/dashboard`.
- Data provenance lives on `/data-sources`, linked from every page footer, and its coverage counts are computed from the live catalog rather than hard-coded, so the page cannot drift from the database.
- The landing page hero states the opportunity-landscape figures (item count, count at the top surtax rate, estimated total import market) computed from the live catalog, never hard-coded, falling back to the static tariff list when the database is unreachable, so the marketing page and the dashboard can never disagree.

