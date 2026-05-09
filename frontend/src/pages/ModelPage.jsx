import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, AlertTriangle, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getModelPage } from "@/data/modelPages";

export default function ModelPage() {
  const { slug } = useParams();
  const page = getModelPage(slug);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{page.title} | Clameo</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={`https://clameo.fr/modeles/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-950">
        <Header />

        <main>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%)]" />

            <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-24">
              <div className="max-w-3xl">
                <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                  Modèle de lettre gratuit
                </p>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {page.title}
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  {page.intro}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/builder/${page.caseType}`}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100"
                  >
                    Créer mon dossier gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>

                  <Link
                    to="/builder"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    Voir tous les modèles
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              <Card
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Quand utiliser cette lettre ?"
                items={page.useCases}
              />

              {page.notFor?.length > 0 && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                    <h2 className="text-2xl font-bold text-slate-950">
                      Quand ne pas utiliser ce modèle ?
                    </h2>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {page.notFor.map((item) => (
                      <li key={item} className="flex gap-3 text-slate-700">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}              

              <Card
                icon={<FileText className="h-5 w-5" />}
                title="Documents utiles à préparer"
                items={page.documents}
              />

              <Card
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Erreurs fréquentes à éviter"
                items={page.mistakes}
              />

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">À savoir</h2>
                <p className="mt-4 leading-7 text-slate-700">
                  {page.officialHelp}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Questions fréquentes</h2>
                </div>

                <div className="mt-6 space-y-5">
                  {page.faq.map((item) => (
                    <div key={item.question} className="border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
                      <h3 className="font-semibold text-slate-950">
                        {item.question}
                      </h3>
                      <p className="mt-2 leading-7 text-slate-700">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Préparer votre dossier</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Répondez à quelques questions, ajoutez vos documents et téléchargez votre dossier complet.
                </p>

                <Link
                  to={`/builder/${page.caseType}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Commencer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Clameo n’est pas un cabinet d’avocat et ne fournit pas de conseil juridique personnalisé.
                </p>
              </div>
            </aside>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

function Card({ icon, title, items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}