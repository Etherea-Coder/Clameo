import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import ClameoLogo from "./Logo";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Nos modèles", to: "/#modeles" },
  { label: "FAQ", to: "/#faq" },
];

export default function Header() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem("clameo:theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Apply + persist
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      try { localStorage.setItem("clameo:theme", "dark"); } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try { localStorage.setItem("clameo:theme", "light"); } catch {}
    }
  }, [dark]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname + location.hash === to;

  const isLanding = location.pathname === "/";

  return (
    <header
      className={`w-full ${isLanding ? "absolute top-0 left-0 border-b border-white/10 bg-transparent backdrop-blur-sm" : "border-b border-border bg-background/80 backdrop-blur-sm sticky top-0"} z-40`}
      data-testid="site-header"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center" data-testid="logo-link">
          <ClameoLogo size={28} textClass="text-2xl" light={isLanding} />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`nav-link text-[15px] ${isLanding ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground"} ${
                isActive(n.to) ? "active" : ""
              }`}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label="Basculer le thème"
            className={`hidden sm:inline-flex items-center gap-2 px-2 py-1.5 rounded-[14px] border transition ${isLanding ? "border-white/20 hover:border-white/40" : "border-border hover:border-foreground/40"}`}
            data-testid="theme-toggle"
          >
            <Sun size={14} className={dark ? "opacity-40" : "opacity-100"} />
            <span
              className={`relative w-8 h-4 rounded-full transition ${
                dark ? "bg-foreground" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-0.5 ${dark ? "left-4" : "left-0.5"} w-3 h-3 rounded-full bg-background transition-all`}
              />
            </span>
            <Moon size={14} className={dark ? "opacity-100" : "opacity-40"} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/builder")}
            className="btn-coral hidden md:inline-flex items-center px-5 py-2.5 rounded-[14px] text-sm font-semibold"
            data-testid="header-cta"
          >
            Créer ma lettre
          </button>

          <button
            type="button"
            className={`md:hidden p-2 ${isLanding ? "text-white" : "text-foreground"}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden border-t ${isLanding ? "border-white/10 bg-black/90 backdrop-blur-md" : "border-border bg-background"} data-testid="mobile-menu"`}>
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`text-base ${isLanding ? "text-white" : "text-foreground"}`}
                data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {n.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/builder");
              }}
              className="btn-coral inline-flex items-center justify-center px-5 py-3 rounded-[14px] text-sm font-semibold mt-2"
              data-testid="mobile-cta"
            >
              Créer ma lettre
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
