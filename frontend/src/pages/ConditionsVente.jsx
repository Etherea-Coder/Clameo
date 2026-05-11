import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "@/components/Seo";

export default function ConditionsVente() {
  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1f2937]">
      <Seo
        title="Conditions de vente — Clameo"
        description="Conditions de vente Clameo : produits numériques, service Radar, paiement, livraison, remboursement et limites importantes."
        path="/conditions-vente"
      />

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
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Conditions de vente
              </h1>
              <p className="mt-2 text-sm text-[#6b7280]">
                Produits numériques, services administratifs et règles simples de remboursement.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-[15px] leading-7 text-[#374151]">
            <section className="space-y-4 rounded-2xl border border-[#eadfd5] bg-[#fbf7f2] p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 flex-none text-[#8b5cf6]" />
                <p>
                  <strong>En clair :</strong> Clameo fournit des outils et services de préparation administrative.
                  Clameo n’est pas un cabinet d’avocat, ne remplace pas un service public et ne garantit pas
                  le résultat d’une démarche. L’utilisateur reste responsable de la vérification et de l’envoi
                  final de ses documents.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Produits et services concernés</h2>
              <p>
                Les présentes conditions s’appliquent aux produits et services payants proposés par Clameo,
                notamment le Kit RGPD Clameo et le service Clameo Radar lorsque celui-ci est proposé après
                une pré-vérification d’éligibilité.
              </p>
              <p>
                Les modèles gratuits disponibles sur Clameo restent accessibles sans achat. Ils sont fournis
                comme outils d’aide à la rédaction et ne constituent pas un conseil juridique personnalisé.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Kit RGPD Clameo</h2>
              <p>
                Le Kit RGPD Clameo est un produit numérique téléchargeable. Il contient notamment un fichier
                HTML autonome, un guide PDF, des modèles d’emails RGPD, un annuaire d’organismes, un tracker,
                un export Excel, une sauvegarde JSON et un système d’envoi assisté.
              </p>
              <p>
                Le kit fonctionne localement dans le navigateur de l’utilisateur. Clameo ne transmet pas les
                demandes RGPD à la place de l’utilisateur. L’utilisateur relit, vérifie et envoie lui-même les
                messages depuis sa propre messagerie ou via le portail officiel de l’organisme concerné.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Clameo Radar</h2>
              <p>
                Le service Clameo Radar correspond à une assistance administrative à la préparation d’un dossier
                radar / ANTAI. Le paiement n’est demandé qu’après une première vérification indiquant que la
                situation semble entrer dans le cadre du service.
              </p>
              <p>
                Clameo ne conteste pas à la place de l’utilisateur, ne représente pas l’utilisateur et ne garantit
                aucun résultat. L’utilisateur reste responsable du dépôt du dossier, de ses déclarations et du
                respect des procédures indiquées sur son avis.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Prix et paiement</h2>
              <p>
                Les prix sont indiqués en euros, toutes taxes applicables incluses lorsque cela est géré par la
                plateforme de paiement ou de distribution utilisée.
              </p>
              <p>
                Les paiements peuvent être traités par des prestataires externes comme Payhip et PayPal. Ces
                prestataires appliquent leurs propres conditions d’utilisation, règles de paiement et politiques
                de confidentialité.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Livraison des produits numériques</h2>
              <p>
                Le Kit RGPD Clameo est livré automatiquement après achat via la plateforme de distribution
                utilisée. L’utilisateur reçoit un lien de téléchargement ou un accès au fichier numérique après
                validation du paiement.
              </p>
              <p>
                Il appartient à l’utilisateur de conserver une copie du fichier téléchargé et de lire le guide PDF
                fourni avec le produit avant utilisation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Droit de rétractation et remboursement</h2>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 h-5 w-5 flex-none text-amber-700" />
                  <p className="text-amber-950/90">
                    Le Kit RGPD Clameo est un contenu numérique fourni sans support matériel et rendu accessible
                    immédiatement après achat.
                  </p>
                </div>
              </div>
              <p>
                En validant l’accès immédiat au fichier numérique, l’acheteur accepte que l’exécution commence
                avant la fin du délai légal de rétractation et reconnaît renoncer à son droit de rétractation pour
                ce contenu numérique, lorsque cette renonciation est applicable.
              </p>
              <p>
                Une fois le fichier téléchargé ou rendu accessible, l’achat est en principe ferme et définitif.
              </p>
              <p>
                Si un problème technique empêche l’accès au fichier, l’acheteur peut contacter Clameo à
                <a
                  href="mailto:hello@clameo.fr"
                  className="font-medium text-[#7c3aed] underline decoration-[#d8c7ff] underline-offset-4"
                >
                  {" "}hello@clameo.fr{" "}
                </a>
                en joignant une capture d’écran et l’adresse email utilisée lors de l’achat. Après vérification,
                Clameo pourra proposer une solution raisonnable : nouveau lien de téléchargement, coupon de
                remplacement ou assistance adaptée.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Licence d’utilisation</h2>
              <p>
                Le Kit RGPD Clameo est fourni pour un usage personnel par l’acheteur. L’utilisateur peut l’utiliser
                sur ses propres appareils, mais ne peut pas le revendre, le redistribuer, le publier en ligne ou le
                partager comme produit gratuit ou payant.
              </p>
              <p>
                L’achat officiel permet de soutenir la maintenance du kit, la mise à jour de l’annuaire et
                l’amélioration des modèles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Mises à jour</h2>
              <p>
                Lorsque des mises à jour importantes du Kit RGPD Clameo sont publiées, elles peuvent être mises
                à disposition via la plateforme d’achat ou le lien de téléchargement initial, selon les possibilités
                techniques du prestataire utilisé.
              </p>
              <p>
                Les mises à jour peuvent inclure des corrections, améliorations du guide, ajustements de modèles
                ou mises à jour ponctuelles de l’annuaire. Elles n’incluent pas un accompagnement individuel, des
                démarches réalisées à la place de l’utilisateur ou un suivi personnalisé.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Limites importantes</h2>
              <ul className="list-disc space-y-2 pl-5 marker:text-[#8b5cf6]">
                <li>Clameo fournit des outils de préparation administrative, pas un conseil juridique personnalisé.</li>
                <li>Clameo ne garantit pas la réponse d’un organisme, d’une administration ou d’un prestataire externe.</li>
                <li>L’utilisateur doit vérifier chaque document, chaque destinataire et chaque information avant envoi.</li>
                <li>En cas de doute ou de situation complexe, il est recommandé de contacter un professionnel compétent.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#111827]">Contact</h2>
              <p>
                Pour toute question concernant un achat, un téléchargement ou l’utilisation d’un produit Clameo,
                vous pouvez écrire à
                <a
                  href="mailto:hello@clameo.fr"
                  className="font-medium text-[#7c3aed] underline decoration-[#d8c7ff] underline-offset-4"
                >
                  {" "}hello@clameo.fr
                </a>
                .
              </p>
            </section>

            <section className="space-y-4 border-t border-black/5 pt-8">
              <p className="text-sm text-[#6b7280]">Dernière mise à jour : mai 2026.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
