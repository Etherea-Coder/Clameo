import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-16 lg:py-24" data-testid="page-confidentialite">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10" data-testid="legal-back">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <p className="eyebrow text-foreground/60">Vos données, vos droits</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
          Politique de <em className="italic text-[#e8502a]">confidentialité</em>
        </h1>

        <div className="mt-10 rounded-md border border-border bg-secondary p-5 flex items-start gap-3">
          <Lock size={18} className="text-trust shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong>En clair :</strong> les informations que vous saisissez dans Clameo restent uniquement dans votre navigateur. Clameo ne les envoie pas à un serveur, ne les stocke pas dans une base de données, et ne les revend jamais.
          </p>
        </div>

        <div className="mt-12 space-y-10 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">1. Quelles données traitons-nous ?</h2>
            <p className="mt-3 text-sm">
              Pour générer une lettre, vous saisissez des informations personnelles (nom, adresse, email, parfois numéro de téléphone) et des éléments relatifs à votre situation (commerçant, propriétaire, employeur, montants, dates…). <strong>Ces données ne quittent jamais votre appareil.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">2. Où sont stockées vos données ?</h2>
            <p className="mt-3 text-sm">
              Toutes les saisies restent en mémoire dans votre navigateur (mémoire de session). Si vous cliquez explicitement sur le bouton « Sauvegarder ce brouillon sur cet appareil », elles sont stockées localement (localStorage) <strong>uniquement</strong> sur l'appareil que vous utilisez.
            </p>
            <p className="mt-3 text-sm">
              Vous pouvez à tout moment cliquer sur « Effacer mes données » pour les supprimer immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">3. Cookies et traceurs</h2>
            <p className="mt-3 text-sm">
              clameo.fr n'utilise pas de cookie publicitaire ni de traceur de profilage. Aucune donnée personnelle n'est partagée avec des régies publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">4. Téléchargement, copie et impression</h2>
            <p className="mt-3 text-sm">
              Lorsque vous copiez, téléchargez ou imprimez votre lettre, l'action est réalisée depuis votre navigateur. Clameo ne reçoit pas le contenu de votre lettre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">5. Vos droits</h2>
            <p className="mt-3 text-sm">
              Clameo ne stocke pas les informations saisies dans le générateur sur ses serveurs. Vous pouvez supprimer les données locales en effaçant le brouillon depuis l'application ou en supprimant les données du site dans votre navigateur.
            </p>
            <p className="mt-3 text-sm">
              Pour toute question relative à la confidentialité, vous pouvez nous écrire à{" "}
              <a href="mailto:hello@clameo.fr" className="underline decoration-coral underline-offset-4 hover:text-foreground">
                hello@clameo.fr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-foreground">6. Service d'envoi en recommandé</h2>
            <p className="mt-3 text-sm">
              Si vous choisissez d'utiliser un service d'envoi en recommandé accessible depuis la page de résultat, vous quittez clameo.fr et serez soumis(e) à la politique de confidentialité du prestataire concerné. Clameo ne transmet pas automatiquement le contenu de votre lettre à ce prestataire.
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
