import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const BUCKET = "case-attachments";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExtensions = new Set(["pdf", "png", "jpg", "jpeg", "doc", "docx"]);

const allowedOrigins = new Set([
  "https://clameo.fr",
  "https://www.clameo.fr",
  "http://localhost:3000",
  "http://localhost:5173",
]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isVercelPreview = /^https:\/\/clameo-.*\.vercel\.app$/.test(origin);
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sanitizeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function getExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, 405, { ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json(req, 500, { ok: false, error: "Configuration serveur incomplète." });
  }

  let form: FormData;

  try {
    form = await req.formData();
  } catch {
    return json(req, 400, { ok: false, error: "Formulaire invalide." });
  }

  const caseSessionId = clean(form.get("caseSessionId"));
  const file = form.get("file");

  if (!caseSessionId || !isUuid(caseSessionId)) {
    return json(req, 400, { ok: false, error: "Session invalide." });
  }

  if (!(file instanceof File)) {
    return json(req, 400, { ok: false, error: "Fichier manquant." });
  }

  if (file.size <= 0) {
    return json(req, 400, { ok: false, error: "Fichier vide." });
  }

  if (file.size > MAX_FILE_SIZE) {
    return json(req, 400, { ok: false, error: "Le fichier dépasse la limite de 10 Mo." });
  }

  const originalName = sanitizeFileName(file.name || "document");
  const extension = getExtension(originalName);
  const mimeType = file.type || "application/octet-stream";

  if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(mimeType)) {
    return json(req, 400, {
      ok: false,
      error: "Type de fichier non autorisé. Formats acceptés : PDF, PNG, JPG, DOC, DOCX.",
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: session, error: sessionError } = await supabase
    .from("case_sessions")
    .select("id, expires_at")
    .eq("id", caseSessionId)
    .single();

  if (sessionError || !session) {
    return json(req, 404, { ok: false, error: "Session introuvable." });
  }

  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (expiresAt.getTime() < now.getTime()) {
    return json(req, 410, { ok: false, error: "Session expirée." });
  }

  // Rate limiting: max 10 attachments per session
  const { count: attachmentCount, error: countError } = await supabase
    .from("case_attachments")
    .select("*", { count: "exact", head: true })
    .eq("case_session_id", caseSessionId);

  if (!countError && attachmentCount !== null && attachmentCount >= 10) {
    return json(req, 429, { ok: false, error: "Limite de 10 fichiers atteinte pour cette session." });
  }

  const fileId = crypto.randomUUID();
  const filePath = `${caseSessionId}/${fileId}-${originalName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return json(req, 500, { ok: false, error: "Impossible d’envoyer le fichier." });
  }

  const { data: attachment, error: insertError } = await supabase
    .from("case_attachments")
    .insert({
      case_session_id: caseSessionId,
      file_name: originalName,
      file_path: filePath,
      file_type: mimeType,
      file_size: file.size,
    })
    .select("id, file_name, file_type, file_size, created_at")
    .single();

  if (insertError) {
    console.error("Attachment insert error:", insertError);

    await supabase.storage.from(BUCKET).remove([filePath]);

    return json(req, 500, {
      ok: false,
      error: "Fichier envoyé, mais impossible de l’enregistrer.",
    });
  }

  // Generate a signed URL for downloading the file (valid for 1 hour)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 3600);

  if (signedUrlError) {
    console.error("Signed URL error:", signedUrlError);
  }

  return json(req, 200, {
    ok: true,
    attachment: {
      ...attachment,
      file_url: signedUrlData?.signedUrl || null,
    },
  });
});