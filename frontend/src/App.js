import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import Landing from "./pages/Landing";
import Builder from "./pages/Builder";
import Result from "./pages/Result";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import Contact from "./pages/Contact";
import ModelPage from "./pages/ModelPage";
import RadarPermis from "./pages/RadarPermis";
import RadarEligibility from "./pages/RadarEligibility";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import KitRgpd from "@/pages/KitRgpd";
import CookieBanner from "@/components/CookieBanner";
import ConditionsVente from "./pages/ConditionsVente";
import AnalyticsTracker from "@/components/AnalyticsTracker";

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div className="App">
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/builder" element={
              <ErrorBoundary>
                <Builder />
              </ErrorBoundary>
            } />
            <Route path="/builder/:caseType" element={
              <ErrorBoundary>
                <Builder />
              </ErrorBoundary>
            } />
            <Route path="/result" element={
              <ErrorBoundary>
                <Result />
              </ErrorBoundary>
            } />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/modeles/:slug" element={<ModelPage />} />
            <Route path="/services/radar-permis" element={<RadarPermis />} />
            <Route path="/services/radar-permis/eligibilite" element={<RadarEligibility />} />
            <Route path="/outils/kit-rgpd" element={<KitRgpd />} />
            <Route path="/conditions-vente" element={<ConditionsVente />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;
