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
  const allowOrigin = allowedOrigins.has(origin) ? origin : "https://clameo.fr";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders(req),
    });
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

  const caseSessionId = body.caseSessionId;

  if (!caseSessionId) {
    return json(req, 400, { ok: false, error: "Case session ID is required" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json(req, 500, { ok: false, error: "Configuration serveur incomplète." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("case_attachments")
    .select("id, file_name, file_type, file_size, created_at")
    .eq("case_session_id", caseSessionId)
    .order("created_at", "asc");

  if (error) {
    console.error("Supabase fetch error:", error);
    return json(req, 500, { ok: false, error: "Impossible de récupérer les fichiers." });
  }

  return json(req, 200, { ok: true, attachments: data });
});
