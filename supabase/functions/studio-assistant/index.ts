// Studio AI Assistant — non-streaming chat via Lovable AI Gateway.
// Verifies caller is staff (admin/editor) using the caller's JWT.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const SYSTEM_PROMPT = `You are the RetentionFirm editorial assistant helping a staff writer.
Focus areas: customer retention, lifecycle marketing, LTV, ecommerce growth strategy.
Voice: sharp, senior, no marketing fluff. Short sentences. Concrete numbers when useful.

You help with:
- Outlining blog posts from a topic or focus keyword.
- Drafting sections in Markdown when asked.
- Sharpening headlines, subheads, and hooks.
- Writing meta titles (<= 60 chars) and meta descriptions (<= 155 chars) that include the focus keyword naturally.
- SEO checklist advice (heading structure, keyword coverage, alt text).
- Tone rewrites and tightening prose.

Rules:
- Reply in Markdown. Use headings (##/###), lists, and short paragraphs.
- When the writer asks to "insert" or "draft" content for the post body, produce clean Markdown they can paste directly — no meta commentary, no wrapper prose.
- When suggesting a meta title or description, state character count in parentheses.
- If the current post context is provided below, tailor answers to it.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Not authenticated" }, 401);
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Not authenticated" }, 401);

    const { data: staff } = await supabase.rpc("is_staff", { _user_id: userData.user.id });
    if (!staff) return json({ error: "Forbidden: staff only" }, 403);

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = body.context && typeof body.context === "object" ? body.context : null;

    if (!messages.length) return json({ error: "messages required" }, 400);

    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      systemPrompt += `\n\n---\nCurrent post context:\n- Title: ${context.title || "(untitled)"}\n- Focus keyword: ${context.focusKeyword || "(none)"}\n- Excerpt: ${context.excerpt || "(none)"}\n- Meta title: ${context.metaTitle || "(none)"}\n- Meta description: ${context.metaDescription || "(none)"}\n- Body word count: ${context.wordCount ?? 0}`;
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (upstream.status === 429) return json({ error: "Rate limited. Try again in a moment." }, 429);
    if (upstream.status === 402) return json({ error: "AI credits exhausted. Add credits in your workspace billing." }, 402);
    if (!upstream.ok) {
      const t = await upstream.text();
      return json({ error: `AI gateway error: ${upstream.status} ${t.slice(0, 200)}` }, 502);
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return json({ reply });
  } catch (e) {
    return json({ error: (e as Error).message || "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
