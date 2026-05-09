import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  XCircle,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supportedCases = [
  "Véhicule vendu avant l’infraction",
  "Véhicule volé ou plaques usurpées",
  "Autre conducteur à désigner",
  "Erreur apparente sur l’avis",
  "Amende majorée non reçue",
  "Contestation de l’infraction — Cas n°3 ANTAI",
];

const excludedCases = [
  "Amende déjà payée",
  "Alcool, stupéfiants ou délit routier grave",
  "Accident avec blessé",
  "Convocation au tribunal",
  "Permis invalidé / courrier 48SI",
  "Suspension administrative ou judiciaire",
  "Demande visant à faire une fausse déclaration",
];

const included = [
  "Vérification rapide de l’éligibilité avant paiement",
  "Checklist des pièces utiles",
  "Préparation d’un courrier ou texte clair",
  "Résumé structuré des faits",
  "Instructions pour déposer le dossier vous-même",
];

export default function RadarPermis() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,116,94,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.18),transparent_34%)]" />

          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                Nouveau service — pré-vérification avant paiement
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Préparer un dossier radar / permis sans paniquer.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Clameo vous aide à organiser les informations, préparer les
                pièces utiles et structurer un dossier clair pour une situation
                radar, amende, points ou ANTAI.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact?subject=radar-permis"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 shadow-lg transition hover:bg-slate-100"
                >
                  Vérifier l’éligibilité de mon dossier
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <a
                  href="#inclus"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Voir ce qui est inclus
                </a>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                Tarif si le dossier est éligible :{" "}
                <span className="font-bold text-white">35 €</span>. Aucun paiement n’est demandé avant la vérification rapide de l’éligibilité de votre dossier.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm md:grid-cols-[auto_1fr]">
            <AlertTriangle className="h-7 w-7 text-amber-700" />
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Important avant toute démarche
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Si vous souhaitez contester, ne payez pas l’amende avant d’avoir vérifié la procédure indiquée sur votre avis. Le paiement d’une amende forfaitaire vaut reconnaissance de l’infraction et peut entraîner, selon l’infraction, le retrait des points correspondants.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 text-2xl font-black">
              Assistance administrative
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Clameo vous aide à préparer un dossier propre et compréhensible.
              Vous restez responsable de la décision finale et du dépôt du
              dossier.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <FileText className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 text-2xl font-black">Dossier clair</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Vous recevez une structure de dossier, une liste de pièces utiles
              et un texte prêt à relire, adapter et transmettre.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Clock className="h-7 w-7 text-slate-700" />
            <h2 className="mt-4 text-2xl font-black">35 € si éligible</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Le paiement n’est demandé que si votre dossier semble éligible après une première vérification. Pas d’abonnement, pas de compte.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Situations généralement adaptées
              </h2>

              <ul className="mt-6 space-y-3">
                {supportedCases.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Situations non prises en charge
              </h2>

              <ul className="mt-6 space-y-3">
                {excludedCases.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <XCircle className="mt-0.5 h-5 w-5 flex-none text-rose-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="inclus" className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                  Ce que vous recevez
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Une préparation accompagnée, pas une promesse miracle.
                </h2>

                <ul className="mt-6 space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  Clameo n’est pas un cabinet d’avocat, ne vous représente pas
                  et ne dépose pas automatiquement le dossier à votre place. Le
                  service ne vise pas à contourner la loi ni à produire une
                  fausse déclaration.
                </div>
              </div>

              <aside className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-300">Tarif de lancement</p>
                <p className="mt-2 text-5xl font-black">35 €</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Paiement unique. Vous ne payez que si votre dossier semble éligible après une première vérification.
                </p>

                <Link
                  to="/contact?subject=radar-permis"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Vérifier mon éligibilité
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Une réponse positive à la pré-vérification ne garantit pas le
                  résultat final de la démarche.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-slate-100">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-3xl font-black tracking-tight">
              Comment ça fonctionne ?
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {[
                ["1", "Vous décrivez brièvement la situation"],
                ["2", "Clameo vérifie si votre dossier semble éligible"],
                ["3", "Si votre dossier est éligible, vous recevez les instructions de paiement."],
                ["4", "Après paiement, le dossier est préparé et envoyé par email"],
              ].map(([number, text]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 font-black text-white">
                    {number}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-700">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}