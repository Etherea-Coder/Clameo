import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#111827] flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-coral/10 text-coral mb-8">
            <span className="text-4xl font-black">404</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Page introuvable</h1>
          <p className="text-[#6b7280] mb-10 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] bg-[#e8502a] text-white font-bold transition-transform hover:scale-[1.02] shadow-md"
            >
              <Home size={18} /> Retour à l'accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] border border-[#e5e7eb] bg-white text-[#111827] font-bold transition-all hover:border-[#111827]"
            >
              <ArrowLeft size={18} /> Page précédente
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
