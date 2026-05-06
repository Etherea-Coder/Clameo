import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section
        className="max-w-[820px] mx-auto px-6 lg:px-12 py-16 lg:py-24"
        data-testid="page-mentions-legales"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10"
          data-testid="legal-back"
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <p className="eyebrow text-foreground/60">Informations légales</p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
          Mentions <em className="italic text-[#e8502a]">légales</em>
        </h1>

        <div className="mt-12 space-y-10 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Éditeur du site
            </h2>

            <p className="mt-3 text-sm">
              Le site <strong>clameo.fr</strong> est édité par :
            </p>

            <p className="mt-3 text-sm">
              <strong>David Ramaugé</strong>
              <br />
              Email :{" "}
              <a
                href="mailto:hello@clameo.fr"
                className="underline decoration-coral underline-offset-4 hover:text-foreground"
              >
                hello@clameo.fr
              </a>
            </p>

            <p className="mt-4 text-sm">
              Le site <strong>clameo.fr</strong> est édité en tant qu'outil
              informatif de génération de modèles de lettres, destiné aux
              utilisateurs souhaitant préparer un courrier structuré à titre
              indicatif.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Directeur de la publication
            </h2>

            <p className="mt-3 text-sm">
              Directeur de la publication : <strong>David Ramaugé</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Hébergement
            </h2>

            <p className="mt-3 text-sm">
              <strong>Frontend :</strong> Vercel Inc. — 340 Pine Street, Suite
              1500, San Francisco, CA 94104, USA
            </p>

            <p className="mt-4 text-sm">
              Le site est hébergé sur une infrastructure cloud sécurisée. Clameo
              ne stocke pas les informations saisies dans le générateur sur ses
              serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Nature du service
            </h2>

            <p className="mt-3 text-sm">
              Clameo permet de générer des modèles de lettres structurées à
              partir des informations saisies par l'utilisateur. Les lettres
              générées sont fournies à titre indicatif et doivent être relues,
              vérifiées et adaptées avant tout envoi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Propriété intellectuelle
            </h2>

            <p className="mt-3 text-sm">
              L'ensemble des contenus présents sur clameo.fr, notamment les
              textes, modèles de lettres, interfaces, éléments graphiques, logo
              et identité visuelle, est protégé par le droit d'auteur. Toute
              reproduction, représentation, modification ou diffusion totale ou
              partielle sans autorisation écrite préalable est interdite, sauf
              pour un usage strictement personnel et privé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Responsabilité
            </h2>

            <p className="mt-3 text-sm">
              Clameo n'est pas un cabinet d'avocats et ne fournit pas de conseil
              juridique personnalisé. Les modèles de lettres et contenus mis à
              disposition sont fournis à titre informatif uniquement.
            </p>

            <p className="mt-3 text-sm">
              L'utilisateur reste responsable de la vérification, de
              l'adaptation, de l'utilisation et de l'envoi des lettres générées
              selon sa situation particulière. Pour toute situation complexe ou
              présentant un enjeu important, il est recommandé de consulter un
              professionnel du droit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Liens externes
            </h2>

            <p className="mt-3 text-sm">
              clameo.fr peut contenir des liens vers des sites tiers, notamment
              des services d'envoi en recommandé ou des ressources utiles.
              Clameo n'exerce aucun contrôle sur ces sites et ne saurait être
              tenu responsable de leur contenu, de leurs conditions
              d'utilisation ou de leur politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Données personnelles
            </h2>

            <p className="mt-3 text-sm">
              Pour plus d'informations sur le traitement des données et le
              fonctionnement local du générateur, consultez notre{" "}
              <Link
                to="/confidentialite"
                className="underline decoration-coral underline-offset-4 hover:text-foreground"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              Droit applicable
            </h2>

            <p className="mt-3 text-sm">
              Les présentes mentions légales sont régies par le droit français.
              Tout litige relatif à l'utilisation du site sera soumis aux
              juridictions françaises compétentes.
            </p>
          </section>

          <p className="text-xs text-foreground/50 pt-4 border-t border-border">
            Dernière mise à jour : décembre 2025.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}