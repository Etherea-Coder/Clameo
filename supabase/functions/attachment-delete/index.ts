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

  const attachmentId = body.attachmentId;

  if (!attachmentId) {
    return json(req, 400, { ok: false, error: "Attachment ID is required" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json(req, 500, { ok: false, error: "Configuration serveur incomplète." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Get attachment info first
  const { data: attachment, error: fetchError } = await supabase
    .from("case_attachments")
    .select("file_path")
    .eq("id", attachmentId)
    .single();

  if (fetchError || !attachment) {
    return json(req, 404, { ok: false, error: "Fichier non trouvé" });
  }

  // Delete from storage
  const { error: deleteError } = await supabase.storage
    .from("case-attachments")
    .remove([attachment.file_path]);

  if (deleteError) {
    console.error("Storage delete error:", deleteError);
    return json(req, 500, { ok: false, error: "Impossible de supprimer le fichier" });
  }

  // Delete from database
  const { error: deleteDbError } = await supabase
    .from("case_attachments")
    .delete()
    .eq("id", attachmentId);

  if (deleteDbError) {
    console.error("Database delete error:", deleteDbError);
    return json(req, 500, { ok: false, error: "Impossible de supprimer l'enregistrement" });
  }

  return json(req, 200, { ok: true });
});
