import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  profile: z.object({
    companyName: z.string(),
    region: z.string(),
    verticals: z.array(z.string()),
    certifications: z.array(z.string()),
    capabilities: z.string(),
    equipmentSoftware: z.string(),
    labourSkills: z.string(),
  }),
  candidates: z.array(z.object({ id: z.string(), hs: z.string(), name: z.string(), sector: z.string() })).max(800),
});

export type AiMatch = { id: string; score: number; reason: string };

export const matchOpportunitiesToProfile = createServerFn({ method: "POST" })
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ matches: AiMatch[]; error?: string }> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { matches: [], error: "AI is not configured." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const p = data.profile;
    const list = data.candidates.map((c) => `${c.id}|${c.hs}|${c.sector}|${c.name}`).join("\n");
    const prompt = `You are a Canadian manufacturing engineer. Pick the products this factory could realistically produce with its CURRENT equipment, capabilities, skills and certifications (little or no new tooling).

FACTORY
Name: ${p.companyName} (${p.region})
Industries: ${p.verticals.join(", ")}
Certifications: ${p.certifications.join(", ")}
Capabilities: ${p.capabilities}
Equipment & software: ${p.equipmentSoftware}
Trade skills: ${p.labourSkills}

PRODUCTS (id|hs|sector|name)
${list}

Return ONLY JSON: {"matches":[{"id":"<id>","score":<0-100 fit>,"reason":"<max 20 words naming the specific equipment/capability that makes it feasible>"}]}
Include at most 30 products with score >= 50, best first. Use ids exactly as given.`;
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        prompt,
        providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
      });
      const text = await result.text;
      const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
      const parsed = JSON.parse(json) as { matches?: AiMatch[] };
      const ids = new Set(data.candidates.map((c) => c.id));
      const matches = (parsed.matches ?? [])
        .filter((m) => ids.has(m.id))
        .map((m) => ({ id: m.id, score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))), reason: String(m.reason ?? "").slice(0, 200) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 30);
      return { matches };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[ai-match]", msg.slice(0, 500));
      if (/402|credit/i.test(msg)) return { matches: [], error: "AI credits are used up. Add credits in Settings → Plans & credits." };
      if (/429/.test(msg)) return { matches: [], error: "Too many requests right now — please try again in a minute." };
      return { matches: [], error: "The AI match couldn't be completed. Please try again." };
    }
  });
