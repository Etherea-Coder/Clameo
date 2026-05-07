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

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

  const name = clean(body.name);
  const email = clean(body.email);
  const requestType = clean(body.requestType);
  const subject = clean(body.subject);
  const message = clean(body.message);
  const consent = body.consent === true;

  if (!name || !email || !requestType || !subject || !message) {
    return json(req, 400, {
      ok: false,
      error: "Tous les champs obligatoires doivent être remplis.",
    });
  }

  if (!consent) {
    return json(req, 400, {
      ok: false,
      error: "Le consentement est obligatoire.",
    });
  }

  if (!isEmail(email)) {
    return json(req, 400, {
      ok: false,
      error: "Adresse email invalide.",
    });
  }

  if (
    name.length > 120 ||
    email.length > 180 ||
    requestType.length > 80 ||
    subject.length > 180 ||
    message.length > 5000
  ) {
    return json(req, 400, {
      ok: false,
      error: "Le message contient des champs trop longs.",
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const contactToEmail = Deno.env.get("CONTACT_TO_EMAIL") || "hello@clameo.fr";
  const contactFromEmail =
    Deno.env.get("CONTACT_FROM_EMAIL") || "Clameo <hello@clameo.fr>";

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    return json(req, 500, {
      ok: false,
      error: "Configuration serveur incomplète.",
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error: insertError } = await supabase
    .from("contact_messages")
    .insert({
      name,
      email,
      request_type: requestType,
      subject,
      message,
      consent,
    });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return json(req, 500, {
      ok: false,
      error: "Impossible d'enregistrer le message.",
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeRequestType = escapeHtml(requestType);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFromEmail,
      to: [contactToEmail],
      reply_to: email,
      subject: `[Clameo] ${requestType} — ${subject}`,
      html: `
        <h2>Nouveau message Clameo</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Type :</strong> ${safeRequestType}</p>
        <p><strong>Sujet :</strong> ${safeSubject}</p>
        <hr />
        <p>${safeMessage}</p>
      `,
      text: `Nouveau message Clameo

Nom : ${name}
Email : ${email}
Type : ${requestType}
Sujet : ${subject}

${message}`,
    }),
  });

  if (!resendResponse.ok) {
    const resendErrorText = await resendResponse.text();
    console.error("Resend error:", resendErrorText);

    return json(req, 500, {
      ok: false,
      error: "Message enregistré, mais notification email non envoyée.",
    });
  }

  return json(req, 200, { ok: true });
});
