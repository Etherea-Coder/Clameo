import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1f2937]">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5b6472] transition hover:text-[#1f2937]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l’accueil
        </Link>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3ede7] text-[#8b5cf6]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Politique de confidentialité
              </h1>
              <p className="mt-2 text-sm text-[#6b7280]">
                Une politique simple : collecter le minimum, expliquer clairement,
                ne jamais promettre plus que la réalité.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-[15px] leading-7 text-[#374151]">
            <section className="space-y-4">
              <p>
                <strong>En clair :</strong> Clameo vous aide à préparer une lettre
                et un dossier. Une partie du fonctionnement reste locale dans votre
                navigateur, mais certaines données peuvent être traitées par nos
                services lorsque vous nous contactez ou lorsque vous ajoutez des
                documents à votre dossier.
              </p>

              <p>
                Nous ne revendons pas vos données. Nous ne transmettons pas
                automatiquement votre lettre ou vos pièces jointes à une
                administration, à un avocat, à une entreprise ou à un partenaire.
                Vous gardez la main sur l’envoi final.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Ce que vous saisissez dans Clameo
              </h2>

              <p>
                Lorsque vous utilisez le générateur, vous pouvez renseigner des
                informations comme votre identité, votre adresse, les coordonnées du
                destinataire, ainsi que les éléments utiles à votre situation :
                dates, montants, références, contexte du litige, documents à
                joindre, etc.
              </p>

              <p>
                Ces informations servent uniquement à produire votre lettre et à
                préparer votre dossier. Le texte est généré dans l’application et
                Clameo ne l’envoie pas automatiquement à un tiers.
              </p>

              <p>
                Certaines données techniques peuvent être conservées pendant votre
                session afin d’afficher le résultat et de permettre le téléchargement
                du dossier.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Pièces jointes et dossier
              </h2>

              <p>
                Si vous ajoutez des fichiers à votre dossier, ces pièces jointes
                sont téléversées vers notre infrastructure technique afin de
                permettre la constitution du dossier téléchargeable.
              </p>

              <p>
                Ces documents ne sont pas envoyés automatiquement à un organisme
                externe. Ils sont utilisés uniquement pour assembler le dossier que
                vous choisissez ensuite de télécharger.
              </p>

              <p>
                Les fichiers sont conservés temporairement puis supprimés
                automatiquement après la durée de conservation prévue par Clameo.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Formulaire de contact
              </h2>

              <p>
                Lorsque vous nous écrivez via le formulaire de contact, nous
                traitons les données que vous nous transmettez volontairement, comme
                votre nom, votre email et le contenu de votre message.
              </p>

              <p>
                Ces informations servent uniquement à répondre à votre demande et à
                assurer le suivi de l’échange.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Pourquoi nous traitons ces données
              </h2>

              <ul className="list-disc space-y-2 pl-5 marker:text-[#8b5cf6]">
                <li>générer votre lettre et votre dossier ;</li>
                <li>permettre l’ajout et l’assemblage de pièces jointes ;</li>
                <li>répondre à vos messages ;</li>
                <li>assurer la sécurité et le bon fonctionnement du service ;</li>
                <li>gérer, si besoin plus tard, la délivrance de produits ou services payants.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Ce que Clameo ne fait pas
              </h2>

              <ul className="list-disc space-y-2 pl-5 marker:text-[#8b5cf6]">
                <li>Clameo ne revend pas vos données.</li>
                <li>Clameo ne cède pas vos documents à des régies publicitaires.</li>
                <li>Clameo n’envoie pas automatiquement votre lettre à votre place.</li>
                <li>Clameo n’ouvre pas de compte utilisateur caché à partir de vos saisies.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Durée de conservation
              </h2>

              <p>
                Les messages envoyés via le formulaire de contact sont conservés
                pendant la durée nécessaire pour traiter votre demande et garder un
                historique raisonnable de l’échange.
              </p>

              <p>
                Les pièces jointes et les sessions techniques liées à la génération
                du dossier sont conservées temporairement, puis supprimées
                automatiquement. Les pièces jointes et sessions associées sont supprimées automatiquement au plus tard 7 jours après leur création.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Prestataires techniques
              </h2>

              <p>
                Clameo s’appuie sur des prestataires techniques pour l’hébergement,
                le stockage temporaire de fichiers, le traitement technique du
                formulaire de contact et l’envoi d’emails transactionnels.
              </p>

              <p>
                Ces prestataires n’interviennent que dans la mesure nécessaire au
                fonctionnement du service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Services externes
              </h2>

              <p>
                Si vous choisissez ensuite d’utiliser un service externe, par
                exemple pour envoyer un recommandé, vous quittez Clameo. Vous
                utilisez alors un service tiers soumis à ses propres conditions et à
                sa propre politique de confidentialité.
              </p>

              <p>
                Clameo ne transmet pas automatiquement votre dossier à ce
                prestataire : vous décidez vous-même de l’envoi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">
                Vos droits
              </h2>

              <p>
                Conformément à la réglementation applicable, vous pouvez demander
                l’accès à vos données, leur rectification, leur effacement ou, selon
                les cas, exercer vos autres droits prévus par la loi.
              </p>

              <p>
                Pour toute question relative à la confidentialité ou pour exercer vos
                droits, vous pouvez écrire à{" "}
                <a
                  href="mailto:hello@clameo.fr"
                  className="font-medium text-[#7c3aed] underline decoration-[#d8c7ff] underline-offset-4"
                >
                  hello@clameo.fr
                </a>
                .
              </p>

              <p>
                Si vous estimez, après nous avoir contactés, que vos droits ne sont
                pas respectés, vous pouvez également adresser une réclamation à la
                CNIL.
              </p>
            </section>

            <section className="space-y-4 border-t border-black/5 pt-8">
              <p className="text-sm text-[#6b7280]">
                Dernière mise à jour : mai 2026.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}