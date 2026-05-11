import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadGoogleAnalytics, trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    loadGoogleAnalytics();
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleConsentUpdate() {
      loadGoogleAnalytics();
      trackPageView(window.location.pathname + window.location.search);
    }

    window.addEventListener("clameo-cookie-consent", handleConsentUpdate);

    return () => {
      window.removeEventListener("clameo-cookie-consent", handleConsentUpdate);
    };
  }, []);

  return null;
}