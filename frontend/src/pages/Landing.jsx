import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, Lock, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LetterPreview from "../components/LetterPreview";
import { CASES, getCase } from "../lib/letterCases";
import { loadDraft, clearDraft } from "../lib/share";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const STEPS = [
  { num: "01", title: "Choisissez votre situation", desc: "Sélectionnez le thème qui correspond à votre problème." },
  { num: "02", title: "Répondez à quelques questions", desc: "Nous adaptons la lettre à votre situation en quelques étapes." },
  { num: "03", title: "Téléchargez votre lettre", desc: "Recevez votre lettre prête à imprimer ou à envoyer par email." },
];

const FAQ = [
  {
    q: "Mes lettres sont-elles juridiquement valables ?",
    a: "Les modèles Clameo sont rédigés à partir des dispositions du droit français en vigueur. Ils constituent un excellent point de départ, mais ne remplacent pas l'avis d'un professionnel pour les cas complexes.",
  },
  {
    q: "Mes données sont-elles stockées ?",
    a: "Non. Pour cette version MVP, vos informations restent dans votre navigateur. Aucun envoi vers un serveur, aucune base de données, aucun cookie marketing.",
  },
  {
    q: "Combien de temps pour générer une lettre ?",
    a: "Environ 2 minutes. Vous répondez à quelques questions ciblées par cas, puis votre lettre s'affiche, prête à être téléchargée en PDF, copiée, ou imprimée.",
  },
  {
    q: "Clameo remplace-t-il un avocat ?",
    a: "Non. Clameo n'est pas un cabinet d'avocats. Pour un litige important, nous recommandons toujours de consulter un professionnel du droit.",
  },
];

export default function Landing() {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const draftCase = draft ? getCase(draft.caseId) : null;

  const onClearDraft = () => {
    clearDraft();
    setDraft(null);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="paper-grain absolute inset-0 opacity-40 pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">
          {/* Left */}
          <div className="lg:col-span-7 fade-up">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-amber-brand" />
              <p className="eyebrow text-ink/70" data-testid="hero-eyebrow">
                Des lettres qui rétablissent l'équilibre
              </p>
            </div>

            <h1
              className="font-serif-display text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] leading-[1.02] mt-6 tracking-tight"
              data-testid="hero-headline"
            >
              Générez votre <em className="italic">lettre</em><br className="hidden sm:block" /> en 2 minutes
            </h1>

            <p className="mt-7 text-lg lg:text-xl text-ink/70 max-w-xl leading-relaxed" data-testid="hero-subtitle">
              Réclamation, remboursement, logement, travail, RGPD… sans écrire une seule ligne.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <Link
                to="/builder"
                className="btn-amber inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold"
                data-testid="hero-cta"
              >
                Créer ma lettre <ArrowRight size={18} />
              </Link>
              <p className="text-sm text-ink/60">Simple, clair, prêt à envoyer.</p>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-ink/60">
              <CheckCircle2 size={16} className="text-sage" />
              <span>Plus de 250 000 lettres générées avec succès</span>
            </div>
          </div>

          {/* Right — letter preview */}
          <div className="lg:col-span-5 fade-up fade-up-delay-2">
            <LetterPreview className="max-w-[440px] mx-auto lg:mx-0 lg:ml-auto" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-deep text-on-deep" data-testid="trust-strip">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {[
            { t: "Conforme droit français", s: "Modèles rédigés et mis à jour par des juristes." },
            { t: "Lettre prête à envoyer", s: "Personnalisée, claire et complète." },
            { t: "2 minutes seulement", s: "Rapide, simple et efficace." },
          ].map((item, i) => (
            <div
              key={item.t}
              className={`px-6 lg:px-10 ${i !== 0 ? "md:border-l border-[#f7f5f0]/15" : ""}`}
            >
              <p className="font-serif-display text-2xl md:text-[26px] tracking-tight">{item.t}</p>
              <p className="mt-2 text-sm text-[#f7f5f0]/70 leading-relaxed">{item.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESUME DRAFT BANNER (only if a draft exists) */}
      {draft && draftCase && (
        <section className="border-b border-ink/10" data-testid="resume-banner">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <Lock size={16} className="text-sage shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="text-sm text-ink">
                  Vous avez un brouillon enregistré sur cet appareil — <span className="font-semibold">{draftCase.title}</span>.
                </p>
                <p className="text-xs text-ink/60">Aucune donnée n'a été envoyée à un serveur.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/builder/${draft.caseId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-ink hover:bg-ink hover:text-paper transition"
                data-testid="resume-cta"
              >
                Reprendre mon brouillon <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={onClearDraft}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-ink/60 hover:text-ink transition"
                data-testid="resume-clear"
                aria-label="Effacer mes données"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* USE CASES */}
      <section className="py-24 lg:py-32" id="modeles" data-testid="usecases-section">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="eyebrow text-ink/60">Nos modèles</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight">
              Quel est votre <em className="italic">problème</em> ?
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {CASES.map((c) => {
              const Icon = c.Icon;
              return (
                <Link
                  key={c.id}
                  to={`/builder/${c.id}`}
                  className="use-card group flex items-start gap-5 p-6 lg:p-7 rounded-md border border-ink/15 bg-card"
                  data-testid={`usecase-${c.id}`}
                >
                  <div className="shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-md border border-ink/15 bg-paper-2">
                    <Icon size={20} strokeWidth={1.6} className="text-ink" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif-display text-[22px] leading-tight">{c.title}</p>
                    <p className="text-sm text-ink/60 mt-1.5 leading-relaxed">{c.short}</p>
                  </div>
                  <ArrowUpRight size={20} className="use-arrow text-ink/40 mt-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 lg:py-32 bg-paper-2 border-y border-ink/10" data-testid="how-section">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow text-ink/60">Démarche</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight">
              Comment ça <em className="italic">marche</em> ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`relative px-0 md:px-10 ${i !== 0 ? "md:border-l border-ink/15" : ""}`}
              >
                <p className="step-num">{s.num}</p>
                <p className="font-serif-display text-2xl mt-6 leading-tight">{s.title}</p>
                <p className="text-sm text-ink/60 mt-3 max-w-[28ch] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="py-24 lg:py-32" data-testid="reassurance-section">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow text-ink/60">Promesse</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-[56px] mt-3 leading-[1.05] tracking-tight">
              Simple, <em className="italic">clair</em>,<br />prêt à envoyer
            </h2>
            <p className="mt-6 text-ink/70 leading-relaxed max-w-md">
              Clameo vous aide à faire valoir vos droits avec des lettres efficaces, sans remplacer un professionnel du droit.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: CheckCircle2, t: "Des modèles fiables", s: "Rédigés par des juristes, conformes au droit français et régulièrement mis à jour." },
              { Icon: Clock, t: "Gain de temps", s: "En 2 minutes, obtenez une lettre complète et personnalisée." },
              { Icon: Lock, t: "Vos données privées", s: "Vos informations restent sur votre appareil. Rien n'est revendu." },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full border border-sage/30 bg-sage/10 flex items-center justify-center">
                  <Icon size={18} strokeWidth={1.6} className="text-sage" />
                </div>
                <p className="font-serif-display text-xl mt-1">{t}</p>
                <p className="text-sm text-ink/60 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 lg:pb-32" id="faq" data-testid="faq-section">
        <div className="max-w-[920px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow text-ink/60">Questions fréquentes</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl mt-3 leading-[1.05] tracking-tight">
              Vous vous <em className="italic">demandez</em> ?
            </h2>
          </div>

          <Accordion type="single" collapsible className="border-t border-ink/10">
            {FAQ.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-ink/10"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="py-6 text-left font-serif-display text-xl hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-ink/70 pb-6 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
