import React from "react";
import { Link } from "react-router-dom";
import ClameoLogo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-deep text-on-deep" data-testid="site-footer">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="text-on-deep">
              <ClameoLogo size={28} textClass="text-2xl" className="text-on-deep" />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/70 max-w-md">
              Clameo n'est pas un cabinet d'avocats. Les lettres générées sont fournies à titre informatif et ne constituent pas un conseil juridique personnalisé.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-white/50 mb-4">Modèles</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/modeles/lettre-demande-remboursement" className="hover:text-coral transition">
                  Lettre de remboursement
                </Link>
              </li>
              <li>
                <Link to="/modeles/lettre-produit-non-livre" className="hover:text-coral transition">
                  Produit non livré
                </Link>
              </li>
              <li>
                <Link to="/modeles/lettre-litige-logement" className="hover:text-coral transition">
                  Litige logement
                </Link>
              </li>
              <li>
                <Link to="/modeles/lettre-mise-en-demeure" className="hover:text-coral transition">
                  Mise en demeure
                </Link>
              </li>
              <li>
                <Link to="/modeles/lettre-demande-rgpd" className="hover:text-coral transition">
                  Demande RGPD
                </Link>
              </li>
              <li>
                <Link to="/modeles/lettre-reclamation-banque" className="hover:text-coral transition">
                  Réclamation bancaire
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow text-white/50 mb-4">Légal</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/mentions-legales" className="hover:text-coral transition" data-testid="footer-legal">Mentions légales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-coral transition" data-testid="footer-privacy">Confidentialité</Link></li>
              <li><Link to="/contact" className="hover:text-coral transition" data-testid="footer-contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Clameo — Fait avec rigueur en France.</p>
          <p>clameo.fr</p>
        </div>
      </div>
    </footer>
  );
}
