const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gaLoaded = false;

export function hasAnalyticsConsent() {
  try {
    const stored = localStorage.getItem("clameo_cookie_consent");
    if (!stored) return false;
    const consent = JSON.parse(stored);
    return Boolean(consent.analytics);
  } catch {
    return false;
  }
}

export function loadGoogleAnalytics() {
  if (!GA_ID || gaLoaded || !hasAnalyticsConsent()) return;

  gaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    send_page_view: false,
  });
}

export function trackPageView(path) {
  if (!GA_ID || !window.gtag || !hasAnalyticsConsent()) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!GA_ID || !window.gtag || !hasAnalyticsConsent()) return;

  window.gtag("event", eventName, {
    ...params,
  });
}