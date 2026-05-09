import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Lock,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CASES, getCase } from "../lib/letterCases";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const STEPS = [
  {
    num: "01",
    title: "Choisissez votre situation",
    desc: "Sélectionnez le thème qui correspond à votre problème.",
  },
  {
    num: "02",
    title: "Répondez à quelques questions",
    desc: "Clameo structure votre démarche en quelques étapes simples.",
  },
  {
    num: "03",
    title: "Téléchargez votre lettre",
    desc: "Votre courrier est prêt à copier, imprimer ou envoyer.",
  },
];

const FAQ = [
  {
    q: "Mes lettres sont-elles juridiquement valables ?",
    a: "Les modèles Clameo sont rédigés à partir des dispositions du droit français en vigueur. Ils constituent un excellent point de départ, mais ne remplacent pas l'avis d'un professionnel pour les cas complexes.",
  },
  {
    q: "Mes données sont-elles stockées ?",
    a: "Vos informations restent privées. La génération de la lettre est locale. Si vous ajoutez des pièces jointes, elles sont stockées temporairement pour constituer votre dossier, puis supprimées automatiquement après 7 jours.",
  },
  {
    q: "Combien de temps pour générer une lettre ?",
    a: "Environ 2 minutes. Vous répondez à quelques questions ciblées, puis votre lettre s'affiche, prête à être téléchargée, copiée ou imprimée.",
  },
  {
    q: "Clameo remplace-t-il un avocat ?",
    a: "Non. Clameo n'est pas un cabinet d'avocats. Pour un litige important, nous recommandons toujours de consulter un professionnel du droit.",
  },
];

const token = {
  ink: "#0e0e0e",
  ink2: "#161616",
  ink3: "#202020",
  coral: "#e8502a",
  coralHover: "#d4441e",
  coralSoft: "rgba(232,80,42,0.12)",
  blue: "#2563eb",
  light: "#fbfaf7",
  white: "#ffffff",
  text: "#111827",
  muted: "#667085",
  border: "#e5e7eb",
  darkText: "#f6f1ea",
  darkMuted: "rgba(246,241,234,0.62)",
  darkDim: "rgba(246,241,234,0.38)",
};

function InjectLandingStyles() {
  return (
    <style>{`
      @keyframes clameoFloat {
        0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
        50% { transform: translateY(-10px) rotate(0.5deg); }
      }

      @keyframes clameoPulse {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.08); }
      }

      @keyframes clameoSlideIn {
        from { opacity: 0; transform: translateY(18px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes clameoBalance {
        0%, 100% { transform: rotate(-1.2deg); }
        50% { transform: rotate(1deg); }
      }

      .clameo-container {
        max-width: 1240px;
        margin: 0 auto;
        padding-left: 48px;
        padding-right: 48px;
      }

      .clameo-hero {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at 14% 12%, rgba(232,80,42,0.18), transparent 32%),
          radial-gradient(circle at 86% 8%, rgba(37,99,235,0.10), transparent 28%),
          linear-gradient(135deg, #0b0b0d 0%, #111111 48%, #16120f 100%);
        color: ${token.darkText};
      }

      .clameo-hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(to bottom, black, transparent 88%);
        pointer-events: none;
      }

      .clameo-hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.18'/%3E%3C/svg%3E");
        opacity: 0.22;
        pointer-events: none;
      }

      .clameo-hero-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: minmax(0, 0.45fr) minmax(420px, 0.55fr);
        gap: 72px;
        align-items: center;
        padding-top: 110px;
        padding-bottom: 92px;
      }

      .clameo-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: ${token.coral};
      }

      .clameo-eyebrow::before {
        content: "";
        width: 34px;
        height: 2px;
        border-radius: 99px;
        background: ${token.coral};
      }

      .clameo-hero-title {
        margin: 24px 0 0;
        max-width: 720px;
        font-family: "DM Serif Display", Georgia, serif;
        font-size: clamp(58px, 7.4vw, 104px);
        line-height: 0.92;
        letter-spacing: -0.055em;
        font-weight: 400;
      }

      .clameo-hero-title em {
        color: ${token.coral};
        font-style: italic;
      }

      .clameo-hero-subtitle {
        margin: 28px 0 0;
        max-width: 570px;
        color: ${token.darkMuted};
        font-size: 18px;
        line-height: 1.72;
      }

      .clameo-hero-actions {
        margin-top: 40px;
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .clameo-btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        min-height: 52px;
        padding: 0 24px;
        border-radius: 16px;
        background: ${token.coral};
        color: #fff;
        font-size: 15px;
        font-weight: 800;
        text-decoration: none;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 18px 52px rgba(232,80,42,0.28);
        transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
      }

      .clameo-btn-primary:hover {
        background: ${token.coralHover};
        transform: translateY(-2px);
        box-shadow: 0 22px 60px rgba(232,80,42,0.34);
      }

      .clameo-btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 48px;
        padding: 0 18px;
        border-radius: 14px;
        background: rgba(255,255,255,0.045);
        color: ${token.darkText};
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid rgba(255,255,255,0.12);
        transition: border-color 180ms ease, background 180ms ease;
      }

      .clameo-btn-secondary:hover {
        border-color: rgba(232,80,42,0.5);
        background: rgba(232,80,42,0.08);
      }

      .clameo-privacy-line {
        margin-top: 26px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.09);
        color: ${token.darkMuted};
        font-size: 13px;
      }

      .clameo-visual {
        position: relative;
        min-height: 560px;
      }

      .balance-stage {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(560px, 100%);
        height: 500px;
        transform: translate(-50%, -50%);
      }

      .balance-beam {
        position: absolute;
        left: 10%;
        right: 10%;
        top: 55%;
        height: 3px;
        border-radius: 99px;
        background: linear-gradient(90deg, rgba(246,241,234,0.18), rgba(232,80,42,0.75), rgba(246,241,234,0.18));
        transform-origin: center;
        animation: clameoBalance 7s ease-in-out infinite;
      }

      .balance-pivot {
        position: absolute;
        left: 50%;
        top: 55%;
        width: 3px;
        height: 90px;
        background: linear-gradient(to bottom, rgba(246,241,234,0.18), rgba(232,80,42,0.35));
        transform: translateX(-50%);
        border-radius: 2px;
      }

      .balance-base {
        position: absolute;
        left: 50%;
        top: calc(55% + 88px);
        width: 48px;
        height: 4px;
        background: rgba(246,241,234,0.25);
        transform: translateX(-50%);
        border-radius: 2px;
      }

      .big-block {
        position: absolute;
        right: 0;
        top: 132px;
        width: 210px;
        min-height: 168px;
        border-radius: 24px;
        background: linear-gradient(180deg, #242424, #171717);
        border: 1px solid rgba(255,255,255,0.09);
        box-shadow: 0 28px 88px rgba(0,0,0,0.34);
        padding: 22px;
        animation: clameoSlideIn 700ms ease both;
      }

      .big-block-label {
        color: ${token.darkDim};
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 10px;
        font-weight: 800;
        margin-bottom: 18px;
      }

      .big-block p {
        margin: 10px 0;
        color: ${token.darkMuted};
        font-size: 13px;
      }

      .problem-note {
        position: absolute;
        left: 8px;
        top: 72px;
        width: 232px;
        border-radius: 22px;
        background: #fff7ef;
        color: ${token.text};
        border: 1px solid rgba(232,80,42,0.20);
        box-shadow: 0 28px 80px rgba(0,0,0,0.25);
        padding: 18px;
        transform: rotate(-4deg);
        animation: clameoSlideIn 700ms 120ms ease both;
      }

      .problem-note span {
        display: inline-flex;
        margin-bottom: 12px;
        color: ${token.coral};
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .problem-note p {
        margin: 8px 0;
        font-size: 13px;
        color: #303030;
      }

      .process-card {
        position: absolute;
        left: 112px;
        top: 218px;
        width: 188px;
        border-radius: 22px;
        background: #111827;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 26px 78px rgba(0,0,0,0.34);
        padding: 18px;
        transform: rotate(3deg);
        animation: clameoSlideIn 700ms 240ms ease both;
      }

      .process-card strong {
        display: block;
        font-size: 26px;
        line-height: 1;
        margin-bottom: 14px;
      }

      .process-card p {
        display: flex;
        justify-content: space-between;
        margin: 9px 0;
        color: rgba(255,255,255,0.64);
        font-size: 12px;
      }

      .process-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: ${token.coral};
        box-shadow: 0 0 0 7px rgba(232,80,42,0.12);
      }

      .final-letter {
        position: absolute;
        right: 38px;
        bottom: 6px;
        width: 330px;
        min-height: 390px;
        border-radius: 26px;
        background: ${token.white};
        color: ${token.text};
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow:
          0 34px 90px rgba(0,0,0,0.38),
          0 0 0 1px rgba(17,24,39,0.08);
        overflow: hidden;
        animation: clameoFloat 7s ease-in-out infinite;
      }

      .final-letter-top {
        height: 8px;
        background: ${token.coral};
      }

      .final-letter-inner {
        padding: 24px;
      }

      .letter-kicker {
        color: ${token.coral};
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .letter-object {
        margin-top: 14px;
        font-size: 19px;
        line-height: 1.24;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .fake-line {
        height: 8px;
        border-radius: 99px;
        background: #e8e8e8;
        margin-top: 12px;
      }

      .fake-line.dark {
        background: #d4d4d4;
      }

      .ready-badge {
        position: absolute;
        right: 18px;
        bottom: 18px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 12px;
        border-radius: 999px;
        background: #ecfdf3;
        color: #027a48;
        font-size: 12px;
        font-weight: 800;
      }

      .ready-badge i {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #12b76a;
        animation: clameoPulse 2.2s ease-in-out infinite;
      }

      .section-light {
        background: ${token.light};
        color: ${token.text};
      }

      .section-card {
        background: ${token.white};
        border: 1px solid ${token.border};
        border-radius: 24px;
        box-shadow: 0 18px 54px rgba(17,24,39,0.04);
      }

      .section-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: ${token.coral};
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .section-eyebrow::before {
        content: "";
        width: 32px;
        height: 2px;
        background: ${token.coral};
        border-radius: 999px;
      }

      .section-title {
        margin: 16px 0 0;
        font-family: "DM Sans", system-ui, sans-serif;
        font-weight: 900;
        letter-spacing: -0.055em;
        line-height: 0.98;
        font-size: clamp(38px, 5vw, 68px);
        color: ${token.text};
      }

      .usecase-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .usecase-card {
        position: relative;
        min-height: 220px;
        padding: 28px;
        border-radius: 24px;
        background: ${token.white};
        border: 1px solid ${token.border};
        text-decoration: none;
        color: ${token.text};
        overflow: hidden;
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }

      .usecase-card::before {
        content: "";
        position: absolute;
        left: 0;
        top: 24px;
        bottom: 24px;
        width: 4px;
        border-radius: 0 99px 99px 0;
        background: ${token.coral};
        opacity: 0;
        transform: scaleY(0.4);
        transition: opacity 180ms ease, transform 180ms ease;
      }

      .usecase-card:hover {
        transform: translateY(-5px);
        border-color: rgba(232,80,42,0.38);
        box-shadow: 0 24px 70px rgba(17,24,39,0.08);
      }

      .usecase-card:hover::before {
        opacity: 1;
        transform: scaleY(1);
      }

      .ticker {
        border-top: 1px solid rgba(255,255,255,0.10);
        border-bottom: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.025);
        position: relative;
        z-index: 1;
        overflow: hidden;
      }

      .ticker-inner {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .ticker-label {
        flex: 0 0 auto;
        background: ${token.coral};
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        padding: 14px 22px;
      }

      .ticker-item {
        flex: 0 0 auto;
        padding: 14px 24px;
        color: ${token.darkMuted};
        border-left: 1px solid rgba(255,255,255,0.10);
        font-size: 13px;
      }

      @media (max-width: 640px) {
        .ticker-label {
          padding: 12px 16px;
          font-size: 10px;
        }
        .ticker-item {
          padding: 12px 18px;
          font-size: 12px;
        }
      }

      @media (max-width: 1024px) {
        .clameo-hero-grid {
          grid-template-columns: 1fr;
          gap: 48px;
          padding-top: 82px;
        }

        .clameo-visual {
          min-height: 520px;
        }

        .balance-stage {
          left: 50%;
          width: min(540px, 100%);
        }

        .usecase-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 720px) {
        .clameo-container {
          padding-left: 22px;
          padding-right: 22px;
        }

        .clameo-hero-grid {
          padding-top: 56px;
          padding-bottom: 64px;
        }

        .clameo-hero-title {
          font-size: clamp(48px, 15vw, 68px);
        }

        .clameo-hero-subtitle {
          font-size: 16px;
        }

        .clameo-privacy-line {
          border-radius: 18px;
          align-items: flex-start;
        }

        .clameo-visual {
          min-height: 460px;
          transform: scale(0.9);
          transform-origin: center top;
          margin-bottom: -42px;
        }

        .balance-stage {
          width: 100%;
        }

        .big-block {
          right: 4px;
          width: 178px;
        }

        .problem-note {
          left: 0;
          width: 200px;
        }

        .process-card {
          left: 70px;
        }

        .final-letter {
          right: 0;
          width: 286px;
        }

        .usecase-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .clameo-hero-title {
          font-size: clamp(40px, 12vw, 56px);
        }

        .clameo-hero-subtitle {
          font-size: 15px;
        }

        .clameo-visual {
          transform: scale(0.85);
          min-height: 420px;
        }

        .big-block {
          width: 160px;
          min-height: 140px;
        }

        .problem-note {
          width: 180px;
        }

        .final-letter {
          width: 260px;
          min-height: 340px;
        }
      }

      @media (max-width: 768px) {
        .section-title {
          font-size: clamp(32px, 5vw, 48px);
        }

        .section-card {
          padding: 32px 28px;
        }
      }

      @media (max-width: 640px) {
        .clameo-hero-actions {
          flex-direction: column;
          gap: 12px;
        }

        .clameo-btn-primary,
        .clameo-btn-secondary {
          width: 100%;
          justify-content: center;
        }
      }
    `}</style>
  );
}

function HeroVisual() {
  return (
    <div className="clameo-visual" aria-hidden="true">
      <div className="balance-stage">
        <div className="balance-beam" />
        <div className="balance-pivot" />
        <div className="balance-base" />

        <div className="big-block">
          <div className="big-block-label">En face</div>
          <p>Entreprise</p>
          <p>Propriétaire</p>
          <p>Employeur</p>
          <p>Service client</p>
        </div>

        <div className="problem-note">
          <span>Problème brut</span>
          <p>Commande non reçue</p>
          <p>Dépôt non rendu</p>
          <p>Données personnelles</p>
        </div>

        <div className="process-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong>3</strong>
            <span className="process-dot" />
          </div>
          <p>
            <span>Situation</span>
            <span>01</span>
          </p>
          <p>
            <span>Détails</span>
            <span>02</span>
          </p>
          <p>
            <span>Ton</span>
            <span>03</span>
          </p>
        </div>

        <div className="final-letter">
          <div className="final-letter-top" />
          <div className="final-letter-inner">
            <div className="letter-kicker">Objet</div>
            <div className="letter-object">Demande de remboursement</div>

            <div style={{ marginTop: 26 }}>
              <div className="fake-line dark" style={{ width: "72%" }} />
              <div className="fake-line" style={{ width: "92%" }} />
              <div className="fake-line" style={{ width: "84%" }} />
              <div className="fake-line" style={{ width: "66%" }} />
            </div>

            <div style={{ marginTop: 30 }}>
              <div className="fake-line dark" style={{ width: "54%" }} />
              <div className="fake-line" style={{ width: "88%" }} />
              <div className="fake-line" style={{ width: "76%" }} />
            </div>

            <div style={{ marginTop: 34, display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="fake-line dark" style={{ width: "52%", marginTop: 4 }} />
                <div className="fake-line" style={{ width: "82%" }} />
              </div>
            </div>
          </div>

          <div className="ready-badge">
            <i />
            Dossier prêt
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelTicker() {
  const items = [
    "Remboursement",
    "Logement",
    "Non-livraison",
    "Mise en demeure",
    "Travail",
    "RGPD",
  ];

  return (
    <div className="ticker">
      <div className="ticker-inner">
        <span className="ticker-label">Modèles</span>
        {items.map((item, index) => (
          <span key={item} className="ticker-item">
            {item}
            {index < items.length - 1 && <span style={{ marginLeft: "12px", color: "rgba(255,255,255,0.3)" }}>•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function CafComingSoonSection() {
  return (
    <section
      id="caf"
      data-testid="caf-coming-section"
      style={{
        padding: "0 0 112px",
        background: token.light,
      }}
    >
      <div className="clameo-container">
        <div
          className="section-card"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "54px 56px",
            display: "grid",
            gridTemplateColumns: "1fr 0.8fr",
            gap: 56,
            alignItems: "center",
            background:
              "linear-gradient(135deg, #ffffff 0%, #fffaf6 48%, #fff1ea 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -90,
              width: 260,
              height: 260,
              borderRadius: "999px",
              background: token.coralSoft,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="section-eyebrow">Section CAF disponible</div>

            <h2
              style={{
                margin: "16px 0 18px",
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 0.98,
                letterSpacing: "-0.055em",
                fontWeight: 900,
                color: token.text,
              }}
            >
              Prenez en main vos démarches CAF.
            </h2>

            <p
              style={{
                margin: 0,
                color: token.muted,
                fontSize: 17,
                lineHeight: 1.75,
                maxWidth: 650,
              }}
            >
              Dossier bloqué, paiement suspendu, demande d’explication ou remise
              de dette : Clameo vous aide à structurer un courrier clair pour
              débloquer votre situation et constituer un dossier complet.
            </p>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                to="/builder/caf-reclamation"
                className="clameo-btn-primary"
                style={{
                  minHeight: 50,
                  padding: "0 24px",
                  borderRadius: 16,
                }}
              >
                Générer un courrier CAF <ArrowRight size={17} />
              </Link>

              <Link
                to="/builder"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  minHeight: 50,
                  padding: "0 20px",
                  borderRadius: 16,
                  border: `1px solid ${token.border}`,
                  background: token.white,
                  color: token.text,
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Voir tous les modèles <ArrowRight size={16} />
              </Link>
            </div>

            <p
              style={{
                margin: "22px 0 0",
                color: token.muted,
                fontSize: 13,
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Clameo n’est pas affilié à la CAF et ne remplace ni un conseiller social, ni un organisme public. L’objectif est d’aider à préparer un courrier et les
              pièces utiles.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gap: 14,
            }}
          >
            {[
              {
                Icon: FileText,
                t: "Réclamation CAF",
                s: "Pour demander une explication ou signaler un dossier bloqué.",
              },
              {
                Icon: ShieldCheck,
                t: "Contestation",
                s: "Pour préparer un recours clair lorsqu’une décision doit être contestée.",
              },
              {
                Icon: Clock,
                t: "Remise de dette",
                s: "Pour structurer une demande de remise gracieuse ou d’échéancier.",
              },
            ].map(({ Icon, t, s }) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "18px 20px",
                  borderRadius: 18,
                  border: `1px solid ${token.border}`,
                  background: "rgba(255,255,255,0.76)",
                  boxShadow: "0 16px 44px rgba(17,24,39,0.04)",
                }}
              >
                <Icon
                  size={19}
                  style={{ color: token.coral, flexShrink: 0, marginTop: 2 }}
                />
                <div>
                  <h3
                    style={{
                      margin: "0 0 5px",
                      fontSize: 16,
                      fontWeight: 900,
                      letterSpacing: "-0.025em",
                      color: token.text,
                    }}
                  >
                    {t}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: token.muted,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {s}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            [data-testid="caf-coming-section"] {
              padding: 0 0 64px;
            }

            [data-testid="caf-coming-section"] > div > div {
              grid-template-columns: 1fr !important;
              gap: 34px !important;
              padding: 34px 28px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

export default function Landing() {
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!document.getElementById("clameo-fonts")) {
      const link = document.createElement("link");
      link.id = "clameo-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: token.light, color: token.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <InjectLandingStyles />

      <Header />

      <section className="clameo-hero" data-testid="hero-section">
        <div className="clameo-container clameo-hero-grid">
          <div>
            <div className="clameo-eyebrow">Clameo rétablit la forme</div>

            <h1 className="clameo-hero-title" data-testid="hero-headline">
              Une lettre peut changer <em>l’équilibre.</em>
            </h1>

            <p className="clameo-hero-subtitle" data-testid="hero-subtitle">
              Remboursement, logement, livraison, travail, RGPD… Clameo transforme
              votre problème en courrier clair, structuré et prêt à envoyer.
            </p>

            <div className="clameo-hero-actions">
              <Link to="/builder" className="clameo-btn-primary" data-testid="hero-cta">
                Créer ma lettre <ArrowRight size={17} />
              </Link>

              <Link to="#modeles" className="clameo-btn-secondary">
                Voir les modèles <ArrowRight size={15} />
              </Link>
            </div>

            <div className="clameo-privacy-line">
              <Lock size={15} style={{ color: token.coral, flexShrink: 0 }} />
              <span>
                Aucune inscription. Votre lettre est générée localement ; les pièces jointes sont seulement stockées temporairement pour créer votre dossier.
              </span>
            </div>
          </div>

          <HeroVisual />
        </div>

        <ModelTicker />
      </section>

      <main className="section-light">
        <section id="modeles" data-testid="usecases-section" style={{ padding: "112px 0", scrollMarginTop: 80 }}>
          <div className="clameo-container">
            <div style={{ maxWidth: 760, marginBottom: 54 }}>
              <div className="section-eyebrow">Nos modèles</div>
              <h2 className="section-title">
                Choisissez votre situation.
              </h2>
              <p style={{ marginTop: 20, color: token.muted, fontSize: 17, lineHeight: 1.7, maxWidth: 620 }}>
                Chaque modèle part d'un problème concret et vous guide vers une lettre claire, utilisable tout de suite.
              </p>
            </div>

            <div className="usecase-grid">
              {CASES.filter(c => c.id !== "caf-reclamation").map((c) => {
                const Icon = c.Icon;
                const isHovered = hoveredCard === c.id;

                return (
                  <Link
                    key={c.id}
                    to={`/builder/${c.id}`}
                    data-testid={`usecase-${c.id}`}
                    className="usecase-card"
                    onMouseEnter={() => setHoveredCard(c.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={{ position: "relative" }}>
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "rgba(17,24,39,0.15)",
                        }}
                      />

                      <div style={{ marginTop: 24 }}>
                        <p
                          style={{
                            margin: "0 0 12px",
                            color: token.coral,
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                          }}
                        >
                          {c.category}
                        </p>

                        <h3
                          style={{
                            margin: 0,
                            fontSize: 22,
                            lineHeight: 1.18,
                            fontWeight: 900,
                            letterSpacing: "-0.035em",
                          }}
                        >
                          {c.title}
                        </h3>

                        <p style={{ margin: "14px 0 0", color: token.muted, fontSize: 14, lineHeight: 1.7 }}>
                          {c.short}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={18}
                        style={{
                          position: "absolute",
                          bottom: 28,
                          right: 28,
                          color: isHovered ? token.coral : "#98a2b3",
                          transition: "color 180ms ease",
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            <style>{`
              @media (max-width: 768px) {
                [data-testid="usecases-section"] {
                  padding: 64px 0;
                }
                [data-testid="usecases-section"] > div > div:first-child {
                  margin-bottom: 36px;
                }
              }
            `}</style>
          </div>
        </section>

        <CafComingSoonSection />

        <section
          data-testid="how-section"
          style={{
            padding: "100px 0",
            background: token.white,
            borderTop: `1px solid ${token.border}`,
            borderBottom: `1px solid ${token.border}`,
          }}
        >
          <div className="clameo-container">
            <div style={{ maxWidth: 760, marginBottom: 64 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(38px, 5vw, 68px)", lineHeight: 0.98, letterSpacing: "-0.055em", fontWeight: 900 }}>
                Du problème au courrier.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  style={{
                    padding: i === 0 ? "0 44px 0 0" : "0 44px",
                    borderLeft: i === 0 ? "none" : `1px solid ${token.border}`,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: token.coral,
                      fontSize: "clamp(48px, 8vw, 72px)",
                      lineHeight: 1,
                      fontWeight: 900,
                      letterSpacing: "-0.08em",
                      opacity: 0.5,
                    }}
                  >
                    {s.num}
                  </span>

                  <h3 style={{ margin: "24px 0 12px", fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 900, letterSpacing: "-0.04em" }}>
                    {s.title}
                  </h3>

                  <p style={{ margin: 0, color: token.muted, fontSize: 14, lineHeight: 1.7 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <style>{`
              @media (max-width: 768px) {
                [data-testid="how-section"] {
                  padding: 64px 0;
                }
                [data-testid="how-section"] > div > div:first-child {
                  margin-bottom: 40px;
                }
                [data-testid="how-section"] > div > div:last-child {
                  grid-template-columns: 1fr;
                  gap: 32px;
                }
                [data-testid="how-section"] > div > div:last-child > div {
                  padding: 0 !important;
                  border-left: none !important;
                  border-bottom: 1px solid ${token.border};
                  padding-bottom: 32px;
                }
                [data-testid="how-section"] > div > div:last-child > div:last-child {
                  border-bottom: none;
                  padding-bottom: 0;
                }
              }
            `}</style>
          </div>
        </section>

        <section data-testid="reassurance-section" style={{ padding: "112px 0" }}>
          <div className="clameo-container">
            <div
              className="section-card"
              style={{
                padding: "48px 52px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <Lock size={20} style={{ color: token.coral }} />
                  <span style={{ color: token.coral, fontSize: 11, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    Privé par défaut
                  </span>
                </div>
                <h2 style={{ margin: "0 0 16px", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.05em", fontWeight: 900 }}>
                  Vos données restent sur votre appareil.
                </h2>
                <p style={{ margin: 0, color: token.muted, fontSize: 17, lineHeight: 1.72, maxWidth: 420 }}>
                  Aucune inscription. Aucun compte. Vos informations restent privées et les pièces jointes sont supprimées automatiquement après 7 jours.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { Icon: CheckCircle2, t: "Modèles structurés", s: "Pensés pour les démarches courantes du droit français." },
                  { Icon: Clock, t: "2 minutes", s: "Un parcours court, clair et sans jargon inutile." },
                ].map(({ Icon, t, s }) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "18px 20px",
                      borderRadius: 16,
                      border: `1px solid ${token.border}`,
                      background: token.white,
                    }}
                  >
                    <Icon size={18} style={{ color: token.text, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em" }}>
                        {t}
                      </h3>
                      <p style={{ margin: 0, color: token.muted, fontSize: 14, lineHeight: 1.6 }}>
                        {s}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @media (max-width: 768px) {
                [data-testid="reassurance-section"] {
                  padding: 64px 0;
                }
                [data-testid="reassurance-section"] > div > div {
                  grid-template-columns: 1fr;
                  gap: 40px;
                  padding: 32px 28px;
                }
              }
            `}</style>
          </div>
        </section>

        <section
          id="faq"
          data-testid="faq-section"
          style={{
            padding: "0 0 112px",
            scrollMarginTop: 80,
          }}
        >
          <div className="clameo-container">
            <div
              className="section-card"
              style={{
                maxWidth: 920,
                margin: "0 auto",
                padding: "54px 56px",
              }}
            >
              <div className="section-eyebrow">Questions fréquentes</div>
              <h2
                style={{
                  margin: "16px 0 38px",
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1,
                  letterSpacing: "-0.055em",
                  fontWeight: 900,
                }}
              >
                Avant de commencer.
              </h2>

              <Accordion type="single" collapsible style={{ borderTop: `1px solid ${token.border}` }}>
              <style>{`
                @media (max-width: 768px) {
                  [data-testid="faq-section"] {
                    padding: 0 0 64px;
                  }
                  [data-testid="faq-section"] > div > div {
                    padding: 32px 24px;
                  }
                  [data-testid="faq-section"] > div > div > h2 {
                    margin-bottom: 28px;
                  }
                }
              `}</style>
                {FAQ.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    data-testid={`faq-item-${idx}`}
                    style={{ borderBottom: `1px solid ${token.border}` }}
                  >
                    <AccordionTrigger
                      style={{
                        padding: "24px 0",
                        fontSize: 17,
                        fontWeight: 900,
                        color: token.text,
                        textAlign: "left",
                      }}
                    >
                      {item.q}
                    </AccordionTrigger>

                    <AccordionContent
                      style={{
                        fontSize: 14,
                        color: token.muted,
                        lineHeight: 1.75,
                        paddingBottom: 24,
                      }}
                    >
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}