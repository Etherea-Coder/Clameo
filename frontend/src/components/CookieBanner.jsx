import { useEffect, useState } from "react";
import { ShieldCheck, SlidersHorizontal, X } from "lucide-react";

const STORAGE_KEY = "clameo_cookie_consent";

const defaultConsent = {
  necessary: true,
  analytics: false,
  partners: false,
  decidedAt: null,
};

function getStoredConsent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveConsent(consent) {
  const finalConsent = {
    ...defaultConsent,
    ...consent,
    necessary: true,
    decidedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConsent));

  window.dispatchEvent(
    new CustomEvent("clameo-cookie-consent", {
      detail: finalConsent,
    })
  );

  return finalConsent;
}

export function getCookieConsent() {
  return getStoredConsent() || defaultConsent;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [partners, setPartners] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();

    if (!stored) {
      setVisible(true);
    } else {
      setAnalytics(Boolean(stored.analytics));
      setPartners(Boolean(stored.partners));
    }

    // Listen for custom event to show banner
    const handleShowBanner = () => {
      setVisible(true);
    };

    window.addEventListener("clameo-show-cookie-banner", handleShowBanner);

    return () => {
      window.removeEventListener("clameo-show-cookie-banner", handleShowBanner);
    };
  }, []);

  function acceptAll() {
    saveConsent({
      analytics: true,
      partners: true,
    });
    setVisible(false);
  }

  function rejectAll() {
    saveConsent({
      analytics: false,
      partners: false,
    });
    setVisible(false);
  }

  function saveCustom() {
    saveConsent({
      analytics,
      partners,
    });
    setVisible(false);
  }

  if (!visible) return null;

return (
  <div className="fixed bottom-5 left-5 z-[9999] w-[calc(100%-2.5rem)] max-w-md">
    <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-300">
                  Confidentialité
                </p>
                <h2 className="mt-1 text-base font-black tracking-tight text-white">
                  Gestion des cookies
                </h2>
              </div>

              <button
                type="button"
                onClick={rejectAll}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Clameo utilise les éléments nécessaires au fonctionnement du site.
              Les mesures d’audience ou liens partenaires ne seront activés
              qu’avec votre accord.
            </p>

            {customize && (
              <div className="mt-4 space-y-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Cookies nécessaires
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Indispensables au fonctionnement du site.
                      </p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-200">
                      Actifs
                    </span>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Mesure d’audience
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Statistiques si un outil d’analyse est activé.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-orange-500"
                  />
                </label>

                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Partenaires
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Suivi partenaire uniquement avec accord.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={partners}
                    onChange={(e) => setPartners(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-orange-500"
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!customize ? (
                <>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white transition hover:bg-orange-700"
                  >
                    Accepter
                  </button>

                  <button
                    type="button"
                    onClick={rejectAll}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Refuser
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomize(true)}
                    className="inline-flex items-center rounded-xl px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                    Personnaliser
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white transition hover:bg-orange-700"
                  >
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    onClick={rejectAll}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Tout refuser
                  </button>

                  <button
                    type="button"
                    onClick={acceptAll}
                    className="rounded-xl px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Tout accepter
                  </button>
                </>
              )}
            </div>

            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              Choix modifiables plus tard depuis “Gérer mes cookies”.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}