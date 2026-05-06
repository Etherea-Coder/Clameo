import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, AlertTriangle, FileText, Shield, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10">
          <MapPin size={16} /> Retour à l'accueil
        </Link>

        <p className="eyebrow text-foreground/60">Contactez Clameo</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
          Une question, une erreur à signaler
        </h1>
        <p className="mt-4 text-foreground/70 max-w-xl">
          Une erreur dans une lettre générée, une question sur le service, ou une demande de partenariat ? Écrivez-nous.
        </p>

        <div className="mt-12 space-y-10">
          {/* Question générale */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Mail className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Question générale</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Utilisez ce formulaire pour toute demande générale, question ou suggestion d'amélioration.
                </p>
              </div>
            </div>
          </section>

          {/* Signaler une erreur */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Signaler une erreur dans une lettre</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Vous avez trouvé une erreur ou une incohérence dans une lettre générée par Clameo ? Décrivez-la nous pour que nous puissions l'améliorer.
                </p>
              </div>
            </div>
          </section>

          {/* Partenariat / Envoi recommandé */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Send className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Partenariat / Envoi recommandé</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Vous êtes un service d'envoi en recommandé, une plateforme juridique, ou un professionnel du droit intéressé par un partenariat ? Contactez-nous pour en discuter.
                </p>
              </div>
            </div>
          </section>

          {/* Confidentialité */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Shield className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Confidentialité</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Les informations que vous envoyez par email servent uniquement à répondre à votre demande. Clameo ne stocke aucune donnée personnelle sur ses serveurs.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Button */}
        <div className="mt-12 text-center">
          <p className="text-sm text-foreground/70 mb-4">
            Pour toute question, écrivez-nous à : 
          </p>
          <p className="text-lg font-medium text-foreground mb-6">
            hello@clameo.fr
          </p>
          <a 
            href="mailto:hello@clameo.fr"
            className="btn-coral inline-flex items-center px-6 py-3 rounded-[14px] text-sm font-semibold"
          >
            <Mail size={16} className="mr-2" />
            Écrire à Clameo
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
