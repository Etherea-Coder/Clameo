import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const allowedOrigins = new Set([
  "https://clameo.fr",
  "https://www.clameo.fr",
  "http://localhost:3000",
  "http://localhost:5173",
]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);
  const allowOrigin =
    allowedOrigins.has(origin) || isVercelPreview ? origin : "https://clameo.fr";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json",
    },
  });
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, 405, { ok: false, error: "Method not allowed" });
  }

  let body: any;

  try {
    body = await req.json();
  } catch {
    return json(req, 400, { ok: false, error: "Invalid JSON body" });
  }

  const caseId = clean(body.caseId);

  if (!caseId || caseId.length > 80) {
    return json(req, 400, { ok: false, error: "Type de lettre invalide." });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json(req, 500, { ok: false, error: "Configuration serveur incomplète." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("case_sessions")
    .insert({ case_id: caseId })
    .select("id, case_id, created_at, expires_at")
    .single();

  if (error) {
    console.error("case-session-create error:", error);
    return json(req, 500, { ok: false, error: "Impossible de créer la session." });
  }

  return json(req, 200, {
    ok: true,
    caseSessionId: data.id,
    session: data,
  });
});