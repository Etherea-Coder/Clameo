import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-16 lg:py-24" data-testid="page-mentions-legales">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink mb-10" data-testid="legal-back">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <p className="eyebrow text-ink/60">Informations légales</p>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight">
          Mentions <em className="italic">légales</em>
        </h1>

        <div className="mt-12 space-y-10 text-ink/85 leading-relaxed">
          <section>
            <h2 className="font-serif-display text-2xl text-ink">Éditeur du site</h2>
            <p className="mt-3 text-sm">
              Le site <strong>clameo.fr</strong> est édité par Clameo. Pour toute demande, vous pouvez nous écrire à :{" "}
              <a href="mailto:contact@clameo.fr" className="underline decoration-amber-brand underline-offset-4 hover:text-ink">
                contact@clameo.fr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-2xl text-ink">Hébergement</h2>
            <p className="mt-3 text-sm">
              Le site est hébergé par un prestataire d'infrastructure cloud. Les coordonnées complètes de l'hébergeur peuvent être communiquées sur demande à l'adresse ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-2xl text-ink">Propriété intellectuelle</h2>
            <p className="mt-3 text-sm">
              L'ensemble des contenus présents sur clameo.fr (textes, modèles de lettres, illustrations, logo, identité graphique) est protégé par le droit d'auteur français et international. Toute reproduction, représentation, modification ou diffusion totale ou partielle, sans autorisation écrite préalable, est interdite, sauf pour un usage strictement personnel et privé.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-2xl text-ink">Responsabilité</h2>
            <p className="mt-3 text-sm">
              Clameo n'est pas un cabinet d'avocats. Les modèles de lettres et les contenus mis à disposition sur clameo.fr sont fournis à titre <strong>informatif uniquement</strong> et ne constituent pas un conseil juridique personnalisé. Pour toute situation litigieuse complexe ou enjeu important, nous recommandons vivement de consulter un professionnel du droit (avocat, juriste, association de consommateurs).
            </p>
            <p className="mt-3 text-sm">
              Clameo ne saurait être tenu responsable des conséquences directes ou indirectes de l'utilisation des lettres générées.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-2xl text-ink">Liens externes</h2>
            <p className="mt-3 text-sm">
              clameo.fr peut contenir des liens vers des sites tiers. Clameo n'exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu.
            </p>
          </section>

          <section>
            <h2 className="font-serif-display text-2xl text-ink">Droit applicable</h2>
            <p className="mt-3 text-sm">
              Les présentes mentions légales sont régies par le droit français. Tout litige sera soumis aux juridictions françaises compétentes.
            </p>
          </section>

          <p className="text-xs text-ink/50 pt-4 border-t border-ink/10">
            Dernière mise à jour : décembre 2025.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
