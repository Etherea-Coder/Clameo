import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const allowedOrigins = new Set([
  "https://clameo.fr",
  "https://www.clameo.fr",
  "http://localhost:3000",
  "http://localhost:5173",
]);

const allowedFileTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const maxFileSize = 10 * 1024 * 1024; // 10 MB

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

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-_]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 100);
}

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
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

  const contentType = req.headers.get("content-type") || "";
  
  if (!contentType.includes("multipart/form-data")) {
    return json(req, 400, { ok: false, error: "Content-Type must be multipart/form-data" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json(req, 500, { ok: false, error: "Configuration serveur incomplète." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const formData = await req.formData();
    const caseSessionId = formData.get("caseSessionId");
    const file = formData.get("file") as File;

    if (!caseSessionId || !file) {
      return json(req, 400, { ok: false, error: "caseSessionId and file are required" });
    }

    // Validate file type
    if (!allowedFileTypes.has(file.type)) {
      return json(req, 400, { ok: false, error: "Type de fichier non autorisé" });
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return json(req, 400, { ok: false, error: "Fichier trop volumineux (max 10 MB)" });
    }

    // Validate filename
    const originalName = sanitizeFilename(file.name);
    const fileExtension = getFileExtension(originalName);
    
    if (!originalName || fileExtension.length === 0) {
      return json(req, 400, { ok: false, error: "Nom de fichier invalide" });
    }

    // Generate unique file ID
    const fileId = crypto.randomUUID();
    const storagePath = `${caseSessionId}/${fileId}-${originalName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("case-attachments")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return json(req, 500, { ok: false, error: "Impossible d'uploader le fichier" });
    }

    // Insert record in database
    const { data: insertData, error: insertError } = await supabase
      .from("case_attachments")
      .insert({
        case_session_id: caseSessionId,
        file_name: originalName,
        file_path: storagePath,
        file_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
      })
      .select("id, file_name, file_type, file_size")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return json(req, 500, { ok: false, error: "Impossible d'enregistrer le fichier" });
    }

    return json(req, 200, { 
      ok: true, 
      attachment: insertData 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return json(req, 500, { ok: false, error: "Erreur lors de l'upload" });
  }
});
