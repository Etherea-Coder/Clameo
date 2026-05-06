import React from "react";

/**
 * Floating Letter Preview — premium hero visual
 * Cream paper, thin coral top border, subtle blurred body lines, layered sheets behind.
 */
export default function LetterPreview({ className = "" }) {
  return (
    <div className={`relative ${className}`} data-testid="hero-letter-preview">
      {/* Sheet behind 2 (kraft) */}
      <div
        className="absolute -right-3 sm:-right-6 top-10 w-[78%] h-[80%] rounded-sm letter-shadow"
        style={{ background: "#d8caa8", transform: "rotate(4deg)" }}
        aria-hidden="true"
      />
      {/* Sheet behind 1 */}
      <div
        className="absolute -right-1 sm:-right-3 top-6 w-[88%] h-[88%] rounded-sm letter-shadow"
        style={{ background: "#fbf8f0", transform: "rotate(2deg)" }}
        aria-hidden="true"
      />
      {/* Main letter */}
      <div
        className="relative bg-white rounded-sm letter-shadow letter-float overflow-hidden"
        style={{ aspectRatio: "1 / 1.32" }}
      >
        {/* Top coral border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8502a]" />

        <div className="p-6 sm:p-9 h-full flex flex-col font-mono-letter text-[11px] sm:text-[12px] text-ink/90 leading-relaxed">
          {/* Sender + recipient */}
          <div className="flex justify-between gap-6">
            <div>
              <p className="font-semibold">Jean Dupont</p>
              <p>12 rue des Lilas</p>
              <p>75011 Paris</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Service Client</p>
              <p>Société Exemple</p>
              <p>1 rue de la Paix</p>
              <p>75002 Paris</p>
            </div>
          </div>

          {/* Date */}
          <p className="mt-6 sm:mt-8">Paris, le 16 mai 2024</p>

          {/* Objet */}
          <div className="mt-6 sm:mt-8">
            <p className="font-semibold">Objet : Demande de remboursement</p>
            <p className="text-ink/70">Réf. commande : 123456789</p>
          </div>

          {/* Salutation */}
          <p className="mt-5">Madame, Monsieur,</p>

          {/* Blurred body lines */}
          <div className="mt-4 space-y-2">
            <div className="blur-line w-[96%]" />
            <div className="blur-line w-[88%]" />
            <div className="blur-line w-[94%]" />
            <div className="blur-line w-[72%]" />
            <div className="blur-line w-[90%]" />
            <div className="blur-line w-[60%]" />
          </div>

          {/* Closing */}
          <div className="mt-auto">
            <p className="leading-snug">
              Dans l'attente de votre retour, je vous prie d'agréer,<br />
              Madame, Monsieur, l'expression de mes salutations distinguées.
            </p>
            <p className="mt-5">Jean Dupont</p>
            <svg
              className="mt-1"
              width="86"
              height="22"
              viewBox="0 0 120 30"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 22 C 14 4, 22 28, 32 14 S 50 6, 60 18 S 78 26, 90 10 S 110 22, 118 16"
                stroke="#1a1f2e"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
