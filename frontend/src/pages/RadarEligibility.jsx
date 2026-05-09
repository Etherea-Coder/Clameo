import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CONTACT_FUNCTION_URL = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/contact-submit`;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const situationOptions = [
  "Je n’étais pas le conducteur",
  "Véhicule vendu avant l’infraction",
  "Véhicule volé",
  "Usurpation de plaques",
  "Erreur apparente sur l’avis",
  "Amende majorée non reçue",
  "Contestation de l’infraction — Cas n°3 ANTAI",
  "Autre situation",
];

const initialForm = {
  name: "",
  email: "",
  finePaid: "",
  noticeDate: "",
  situationType: "",
  courtSummons: "",
  seriousCase: "",
  summary: "",
  consent: false,
};

export default function RadarEligibility() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const hasRiskFlag = useMemo(() => {
    return (
      form.finePaid === "Oui" ||
      form.courtSummons === "Oui" ||
      form.seriousCase === "Oui"
    );
  }, [form]);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildMessage = () => {
    return [
      `Nom : ${form.name}`,
      `Email : ${form.email}`,
      `Amende déjà payée : ${form.finePaid}`,
      `Date de l’avis ou notification : ${form.noticeDate || "Non renseignée"}`,
      `Type de situation : ${form.situationType}`,
      `Convocation au tribunal : ${form.courtSummons}`,
      `Alcool / stupéfiants / accident / délit grave : ${form.seriousCase}`,
      "",
      "Résumé :",
      form.summary,
      "",
      hasRiskFlag
        ? "⚠️ Signal d’attention : le dossier contient au moins une réponse pouvant le rendre non éligible au service Radar."
        : "Aucun signal d’exclusion automatique évident dans les réponses déclarées.",
    ].join("\n");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.consent) {
      setError("Merci de confirmer que les informations transmises sont exactes.");
      return;
    }

    setStatus("loading");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        subject: "Demande d’éligibilité Radar / permis",
        message: buildMessage(),
        requestType: "radar-permis",
        consent: true,
      };

        if (!CONTACT_FUNCTION_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Configuration Supabase manquante");
        }

        const response = await fetch(CONTACT_FUNCTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
        throw new Error(data.error || "Erreur lors de l’envoi de la demande.");
        }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(
        "Impossible d’envoyer la demande pour le moment. Merci de réessayer dans quelques instants."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main>
        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
            <Link
              to="/services/radar-permis"
              className="inline-flex items-center text-sm font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au service Radar / permis
            </Link>

            <div className="mt-10 max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                Pré-vérification gratuite avant paiement
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Vérifier l’éligibilité de votre dossier radar / permis
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Répondez à quelques questions. Aucun paiement n’est demandé à ce
                stade. Si votre dossier semble éligible, vous recevrez les
                prochaines étapes par email.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          {status === "success" ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
              <CheckCircle2 className="h-9 w-9 text-emerald-700" />
              <h2 className="mt-5 text-2xl font-black">
                Demande envoyée
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Votre demande d’éligibilité a bien été transmise. Aucun paiement
                n’est demandé à ce stade. Si votre dossier semble éligible, vous
                recevrez les prochaines étapes par email.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
              >
                Retour à l’accueil
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nom et prénom" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                    placeholder="Ex : David Martin"
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                    placeholder="vous@email.fr"
                  />
                </Field>

                <Field label="Avez-vous déjà payé l’amende ?" required>
                  <select
                    required
                    value={form.finePaid}
                    onChange={(e) => updateField("finePaid", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  >
                    <option value="">Sélectionner</option>
                    <option>Non</option>
                    <option>Oui</option>
                    <option>Je ne sais pas</option>
                  </select>
                </Field>

                <Field label="Date de l’avis ou de la notification">
                  <input
                    type="date"
                    value={form.noticeDate}
                    onChange={(e) => updateField("noticeDate", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  />
                </Field>

                <Field label="Type de situation" required>
                  <select
                    required
                    value={form.situationType}
                    onChange={(e) =>
                      updateField("situationType", e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  >
                    <option value="">Sélectionner</option>
                    {situationOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Avez-vous une convocation au tribunal ?" required>
                  <select
                    required
                    value={form.courtSummons}
                    onChange={(e) =>
                      updateField("courtSummons", e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  >
                    <option value="">Sélectionner</option>
                    <option>Non</option>
                    <option>Oui</option>
                  </select>
                </Field>

                <Field
                  label="Le dossier concerne-t-il alcool, stupéfiants, accident ou délit grave ?"
                  required
                >
                  <select
                    required
                    value={form.seriousCase}
                    onChange={(e) => updateField("seriousCase", e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  >
                    <option value="">Sélectionner</option>
                    <option>Non</option>
                    <option>Oui</option>
                  </select>
                </Field>
              </div>

              {hasRiskFlag && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
                    <p className="text-sm leading-6 text-slate-700">
                      Votre réponse indique une situation qui peut dépasser le
                      cadre du service Clameo Radar. Vous pouvez envoyer la
                      demande, mais le dossier pourra être refusé après
                      vérification.
                    </p>
                  </div>
                </div>
              )}

              <Field label="Résumé de la situation" required className="mt-6">
                <textarea
                  required
                  rows={7}
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950"
                  placeholder="Expliquez brièvement la situation : type d’avis, date, contexte, ce que vous souhaitez faire, documents disponibles..."
                />
              </Field>

              <label className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Je confirme que les informations transmises sont exactes et je
                  comprends que Clameo n’est pas un cabinet d’avocat, ne garantit
                  aucun résultat et ne dépose pas le dossier à ma place.
                </span>
              </label>

              {error && (
                <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande d’éligibilité
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="text-sm leading-6 text-slate-500">
                  Aucun paiement n’est demandé maintenant.
                </p>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
    </label>
  );
}