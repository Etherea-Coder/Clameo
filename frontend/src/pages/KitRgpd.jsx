import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  MailCheck,
  ShieldCheck,
  Table,
  Upload,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

const PAYHIP_KIT_RGPD_URL = "https://payhip.com/b/g1DZG";

const features = [
  {
    icon: FileText,
    title: "7 modèles d’emails RGPD",
    text: "Effacement, accès, opposition, rectification, limitation, portabilité et relance.",
  },
  {
    icon: UserCheck,
    title: "Profil automatique",
    text: "Vos informations sont insérées automatiquement dans chaque demande.",
  },
  {
    icon: MailCheck,
    title: "Envoi assisté",
    text: "Gmail, Outlook Web, fichier .eml ou copie manuelle : vous gardez toujours le contrôle.",
  },
  {
    icon: Table,
    title: "Tracker de suivi",
    text: "Suivi des organismes, statuts, dates d’envoi, relances et échéances J+30.",
  },
  {
    icon: Download,
    title: "Export Excel",
    text: "Exportez votre tracker pour archiver, imprimer ou suivre vos démarches hors du kit.",
  },
  {
    icon: Upload,
    title: "Sauvegarde JSON",
    text: "Exportez et réimportez votre progression si vous changez d’ordinateur ou de navigateur.",
  },
];

const included = [
  "Fichier HTML autonome à ouvrir dans votre navigateur",
  "Annuaire de 62 organismes, plateformes et courtiers",
  "Modèles RGPD prêts à personnaliser",
  "Assistant de préparation en 4 étapes",
  "Envoi assisté via Gmail, Outlook Web, .eml ou copie",
  "Tracker avec statuts et échéances",
  "Export Excel du suivi",
  "Sauvegarde / restauration JSON",
  "Checklist pratique",
  "Guide d’utilisation PDF",
];

const limits = [
  "Clameo ne fait pas les démarches à votre place.",
  "Clameo ne transmet aucune demande pour vous.",
  "Le kit ne constitue pas un conseil juridique personnalisé.",
  "Les coordonnées des organismes peuvent évoluer.",
  "Vous devez vérifier chaque message avant envoi.",
];

const faqs = [
  {
    q: "Le kit fonctionne-t-il sans compte ?",
    a: "Oui. Le Kit RGPD Clameo fonctionne localement dans votre navigateur. Aucun compte Clameo n’est nécessaire.",
  },
  {
    q: "Mes données sont-elles envoyées à Clameo ?",
    a: "Non. Le kit est conçu pour fonctionner localement. Les informations saisies restent sur votre appareil, sauf si vous décidez vous-même d’envoyer un email à un organisme.",
  },
  {
    q: "Clameo envoie-t-il les demandes à ma place ?",
    a: "Non. Clameo prépare les messages et vous guide, mais vous restez responsable de l’envoi depuis votre propre messagerie.",
  },
  {
    q: "Puis-je utiliser Gmail ou Outlook ?",
    a: "Oui. Le kit propose un envoi assisté via Gmail ou Outlook Web. Vous pouvez aussi télécharger un fichier .eml ou copier le message.",
  },
  {
    q: "Est-ce un service juridique ?",
    a: "Non. Il s’agit d’un outil de préparation administrative. Le kit ne remplace pas un avocat, la CNIL ou un professionnel du droit.",
  },
  {
    q: "Comment recevoir le kit après achat ?",
    a: "Après paiement sur Payhip, vous recevez automatiquement le fichier ZIP à télécharger. Il contient le fichier HTML du kit et le guide PDF d’utilisation.",
  },
  {
    q: "Les mises à jour sont-elles incluses ?",
    a: "L’achat inclut l’accès aux corrections et mises à jour importantes de la version actuelle lorsqu’elles sont publiées. Les acheteurs peuvent recevoir les informations de mise à jour via Payhip.",
  },
];

export default function KitRgpd() {
  return (
    <>
      <div className="min-h-screen bg-[#fafafa] text-slate-950">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,80,42,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(15,23,42,0.06),transparent_30%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
                <ShieldCheck className="h-4 w-4" />
                Disponible
              </div>

                <h1 className="mt-7 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Kit RGPD Clameo
                </h1>

                <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-slate-800">
                  Un espace local pour préparer, envoyer et suivre vos demandes
                  RGPD vous-même.
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Modèles d’emails, annuaire d’organismes, envoi assisté,
                  tracker, checklist, export Excel et sauvegarde JSON — sans
                  compte, sans abonnement, avec vos données sur votre appareil.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-sm">
                    Prix de lancement : 29 €
                  </div>

                  <span className="text-sm text-slate-500">
                    Paiement unique · Pas d’abonnement
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={PAYHIP_KIT_RGPD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("kit_rgpd_buy_click", {
                        location: "hero",
                        price: 29,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-6 py-4 text-sm font-black text-white shadow-sm transition hover:bg-orange-700"
                  >
                    Acheter le Kit RGPD — 29 €
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>

                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    Retour à l’accueil
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Aucun compte
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Usage local
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Export Excel
                  </span>
                </div>
              </div>

              {/* Product mock card */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
                <div className="rounded-[1.5rem] border border-slate-200 bg-[#fafaf9] p-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-sm font-black text-orange-600">
                        Clameo
                      </p>
                      <p className="text-xs text-slate-500">
                        Espace RGPD personnel
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Local
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-3xl font-light tracking-tight">62</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        Organismes
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-3xl font-light tracking-tight">7</p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        Modèles
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">
                      Envoi assisté
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Ouvrez chaque message dans Gmail, Outlook Web, un fichier
                      .eml ou copiez-le manuellement.
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {["À envoyer", "Envoyé", "Relance J+30"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-slate-700">
                          {item}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust strip */}
          <section className="border-b border-slate-200 bg-slate-950">
            <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 text-white md:grid-cols-3 lg:px-8">
              <div className="flex gap-3">
                <Lock className="mt-1 h-5 w-5 flex-none text-orange-400" />
                <div>
                  <p className="font-black">Vos données restent locales</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Le kit fonctionne dans votre navigateur, sans compte Clameo.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MailCheck className="mt-1 h-5 w-5 flex-none text-orange-400" />
                <div>
                  <p className="font-black">Vous envoyez vous-même</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Clameo prépare les messages, mais ne les transmet pas à
                    votre place.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 flex-none text-orange-400" />
                <div>
                  <p className="font-black">Préparation administrative</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Ce kit ne constitue pas un conseil juridique personnalisé.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-[#fafafa] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                  Ce que contient le kit
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Un vrai espace de travail RGPD, pas seulement des modèles à
                  copier.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Le Kit RGPD Clameo aide à préparer les demandes, organiser les
                  envois, suivre les réponses et garder une trace claire des
                  démarches.
                </p>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-lg font-black text-slate-950">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {feature.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Included */}
          <section className="border-y border-slate-200 bg-white py-20">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                  Inclus
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Un pack simple à télécharger et à utiliser.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  L’objectif est de donner à l’utilisateur une méthode claire,
                  sans compte, sans abonnement et sans interface compliquée.
                </p>

                <div className="mt-8 rounded-3xl border border-orange-200 bg-orange-50 p-6">
                  <p className="text-sm font-black text-orange-800">
                    Positionnement important
                  </p>
                  <p className="mt-2 text-sm leading-7 text-orange-950/80">
                    Clameo ne fait pas les démarches à la place de
                    l’utilisateur. Le kit prépare et organise, mais chaque
                    message doit être vérifié puis envoyé par l’utilisateur.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-[#fafafa] p-6">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="bg-[#fafafa] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                  Fonctionnement
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Une méthode guidée, étape par étape.
                </h2>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-4">
                {[
                  [
                    "01",
                    "Renseignez votre profil",
                    "Nom, email, date de naissance et adresse postale pour personnaliser les demandes.",
                  ],
                  [
                    "02",
                    "Choisissez les organismes",
                    "Sélectionnez les plateformes, services ou courtiers concernés.",
                  ],
                  [
                    "03",
                    "Choisissez le droit RGPD",
                    "Effacement, accès, opposition, rectification, limitation ou portabilité.",
                  ],
                  [
                    "04",
                    "Envoyez et suivez",
                    "Utilisez l’envoi assisté, puis suivez chaque demande dans le tracker.",
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="text-sm font-black text-orange-600">
                      {number}
                    </div>
                    <h3 className="mt-4 text-lg font-black text-slate-950">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Limits */}
          <section className="border-y border-slate-200 bg-white py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                  Limites importantes
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Le kit doit rester clair, honnête et administratif. Il aide à
                  préparer des demandes, mais ne remplace pas un professionnel.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-[#fafafa] p-6">
                <ul className="space-y-3">
                  {limits.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-[#fafafa] py-20">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                  FAQ
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Questions fréquentes
                </h2>
              </div>

              <div className="mt-12 space-y-4">
                {faqs.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-base font-black text-slate-950">
                      {item.q}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-slate-950 py-20 text-white">
            <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
                Disponible maintenant
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Kit RGPD Clameo — disponible à 29 €
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Paiement unique via Payhip. Après l’achat, vous recevez automatiquement le ZIP contenant le kit HTML et le guide PDF.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={PAYHIP_KIT_RGPD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("kit_rgpd_buy_click", {
                      location: "bottom_cta",
                      price: 29,
                    })
                  }
                  className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-6 py-4 text-sm font-black text-white transition hover:bg-orange-700"
                >
                  Acheter le Kit RGPD — 29 €
                </a>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Retour à l’accueil
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}