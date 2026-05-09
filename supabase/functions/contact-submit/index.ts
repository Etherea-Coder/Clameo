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

function getRadarAutoRefusalReasons(radarData: any) {
  const reasons: string[] = [];

  if (radarData?.finePaid === "Oui") {
    reasons.push("Amende déjà payée");
  }

  if (radarData?.courtSummons === "Oui") {
    reasons.push("Convocation au tribunal");
  }

  if (radarData?.seriousCase === "Oui") {
    reasons.push("Alcool / stupéfiants / accident / délit grave");
  }

  return reasons;
}

function buildUserAutoRefusalEmail() {
  const subject = "Clameo Radar — réponse à votre demande d’éligibilité";

  const text = `Bonjour,

Merci pour votre demande.

D’après les informations transmises, votre situation semble dépasser le cadre du service Clameo Radar.

Clameo propose une assistance administrative simple à la préparation de dossiers radar / ANTAI, mais ne traite pas les situations nécessitant une analyse juridique approfondie, une représentation, une procédure judiciaire ou un dossier sensible.

Nous vous invitons à suivre les indications figurant sur votre avis et, si nécessaire, à vous rapprocher d’un professionnel compétent ou d’un service adapté à votre situation.

Aucun paiement n’est demandé pour cette demande d’éligibilité.

Cordialement,
Clameo
hello@clameo.fr
https://clameo.fr`;

  const html = text
    .split("\n")
    .map((line) => (line ? escapeHtml(line) : ""))
    .join("<br />");

  return { subject, text, html };
}

async function sendEmail({
  resendApiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: {
  resendApiKey: string;
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const payload: Record<string, unknown> = {
    from,
    to,
    subject,
    html,
    text,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  return await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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

  const name = clean(body.name);
  const email = clean(body.email);
  const requestType = clean(body.requestType);
  const subject = clean(body.subject);
  const message = clean(body.message);
  const consent = body.consent === true;
  const radarData = body.radarData && typeof body.radarData === "object" ? body.radarData : null;

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

  const isRadarRequest = requestType === "radar-permis";
  const autoRefusalReasons = isRadarRequest
    ? getRadarAutoRefusalReasons(radarData)
    : [];
  const shouldAutoRefuse = isRadarRequest && autoRefusalReasons.length > 0;
  const radarStatus = isRadarRequest
    ? shouldAutoRefuse
      ? "auto_refused"
      : "manual_review"
    : null;

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

  // Basic rate limiting: check if this email has sent more than 3 messages in the last hour.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .gt("created_at", oneHourAgo);

  if (!countError && count !== null && count >= 3) {
    return json(req, 429, {
      ok: false,
      error: "Trop de messages envoyés. Veuillez réessayer plus tard.",
    });
  }

  const { data: insertedMessage, error: insertError } = await supabase
    .from("contact_messages")
    .insert({
      name,
      email,
      request_type: requestType,
      subject,
      message,
      consent,
      radar_status: radarStatus,
      auto_refusal_reason: autoRefusalReasons.join(", ") || null,
      eligibility_payload: radarData,
      user_email_sent: false,
    })
    .select("id")
    .single();

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
  const safeRadarStatus = radarStatus ? escapeHtml(radarStatus) : "";
  const safeAutoReasons = autoRefusalReasons.length
    ? escapeHtml(autoRefusalReasons.join(", "))
    : "Aucune";

  const internalSubject = shouldAutoRefuse
    ? `[Clameo] Radar / permis — auto-refusé — ${name}`
    : `[Clameo] ${requestType} — ${subject}`;

  const internalHtml = shouldAutoRefuse
    ? `
        <h2>Radar / permis — demande auto-refusée</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Statut :</strong> ${safeRadarStatus}</p>
        <p><strong>Raison(s) :</strong> ${safeAutoReasons}</p>
        <hr />
        <p>${safeMessage}</p>
      `
    : `
        <h2>Nouveau message Clameo</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> ${safeEmail}</p>
        <p><strong>Type :</strong> ${safeRequestType}</p>
        <p><strong>Sujet :</strong> ${safeSubject}</p>
        <hr />
        <p>${safeMessage}</p>
      `;

  const internalText = shouldAutoRefuse
    ? `Radar / permis — demande auto-refusée

Nom : ${name}
Email : ${email}
Statut : ${radarStatus}
Raison(s) : ${autoRefusalReasons.join(", ")}

${message}`
    : `Nouveau message Clameo

Nom : ${name}
Email : ${email}
Type : ${requestType}
Sujet : ${subject}

${message}`;

  const internalResendResponse = await sendEmail({
    resendApiKey,
    from: contactFromEmail,
    to: [contactToEmail],
    replyTo: email,
    subject: internalSubject,
    html: internalHtml,
    text: internalText,
  });

  if (!internalResendResponse.ok) {
    const resendErrorText = await internalResendResponse.text();
    console.error("Resend internal email error:", resendErrorText);

    return json(req, 500, {
      ok: false,
      error: "Message enregistré, mais notification email non envoyée.",
    });
  }

  if (shouldAutoRefuse) {
    const userEmail = buildUserAutoRefusalEmail();

    const userResendResponse = await sendEmail({
      resendApiKey,
      from: contactFromEmail,
      to: [email],
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text,
    });

    if (!userResendResponse.ok) {
      const resendErrorText = await userResendResponse.text();
      console.error("Resend user auto-refusal email error:", resendErrorText);

      return json(req, 500, {
        ok: false,
        error: "Demande enregistrée, mais l'email de réponse n'a pas pu être envoyé.",
      });
    }

    if (insertedMessage?.id) {
      const { error: updateError } = await supabase
        .from("contact_messages")
        .update({ user_email_sent: true })
        .eq("id", insertedMessage.id);

      if (updateError) {
        console.error("Supabase user_email_sent update error:", updateError);
      }
    }
  }

  return json(req, 200, {
    ok: true,
    radarStatus,
  });
});
