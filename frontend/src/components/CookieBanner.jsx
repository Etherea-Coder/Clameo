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
      return;
    }

    setAnalytics(Boolean(stored.analytics));
    setPartners(Boolean(stored.partners));
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
    <div className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                      Confidentialité
                    </p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                      Gestion des cookies
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={rejectAll}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Clameo utilise les éléments nécessaires au fonctionnement du
                  site. Si nous activons des mesures d’audience ou des liens
                  partenaires, ils ne seront utilisés qu’avec votre accord.
                </p>

                {!customize && (
                  <p className="mt-3 text-xs leading-6 text-slate-500">
                    Vous pouvez accepter, refuser ou personnaliser vos choix.
                    Les cookies nécessaires restent toujours actifs.
                  </p>
                )}

                {customize && (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-slate-950">
                            Cookies nécessaires
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Indispensables au fonctionnement du site et à vos
                            choix de confidentialité.
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                          Toujours actifs
                        </span>
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          Mesure d’audience
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Nous aide à comprendre l’utilisation du site, si un
                          outil d’analyse est activé plus tard.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="mt-1 h-5 w-5 accent-orange-600"
                      />
                    </label>

                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          Partenaires / affiliation
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Permettra d’activer certains liens ou suivis
                          partenaires uniquement avec votre accord.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={partners}
                        onChange={(e) => setPartners(e.target.checked)}
                        className="mt-1 h-5 w-5 accent-orange-600"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex flex-col gap-3">
              {!customize ? (
                <>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700"
                  >
                    Accepter
                  </button>

                  <button
                    type="button"
                    onClick={rejectAll}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                  >
                    Refuser
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomize(true)}
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Personnaliser
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700"
                  >
                    Enregistrer mes choix
                  </button>

                  <button
                    type="button"
                    onClick={rejectAll}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                  >
                    Tout refuser
                  </button>

                  <button
                    type="button"
                    onClick={acceptAll}
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
                  >
                    Tout accepter
                  </button>
                </>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Vous pourrez modifier vos choix plus tard depuis la politique de
              confidentialité ou un lien “Gérer mes cookies”.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}