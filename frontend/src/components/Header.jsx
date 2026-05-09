import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ClameoLogo from "./Logo";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Nos modèles", to: "/#modeles" },
  { label: "CAF", to: "/#caf" },
  { label: "FAQ", to: "/#faq" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === "/";

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/" && !location.hash;
    if (to.startsWith("/#")) return location.pathname === "/" && location.hash === to.replace("/", "");
    return location.pathname === to;
  };

  const linkClass = (to) =>
    `nav-link text-[15px] ${
      isLanding
        ? "text-white/80 hover:text-white"
        : "text-foreground/80 hover:text-foreground"
    } ${isActive(to) ? "active" : ""}`;

  const mobileLinkClass = () =>
    `text-base ${isLanding ? "text-white" : "text-foreground"}`;

  return (
    <header
      className={`w-full ${
        isLanding
          ? "absolute top-0 left-0 border-b border-white/10 bg-transparent backdrop-blur-sm"
          : "border-b border-border bg-background/80 backdrop-blur-sm sticky top-0"
      } z-40`}
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
              className={linkClass(n.to)}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
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

      {open && (
        <div
          className={`md:hidden border-t ${
            isLanding
              ? "border-white/10 bg-black/90 backdrop-blur-md"
              : "border-border bg-background"
          }`}
          data-testid="mobile-menu"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={mobileLinkClass()}
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