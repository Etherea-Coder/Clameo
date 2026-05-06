import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Copy, Download, Printer, Check, FileText,
  Pencil, RotateCcw, Eye, Share2, Send, Lock,
} from "lucide-react";
import jsPDF from "jspdf";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { buildLetter } from "../lib/letterTemplates";
import { getCase } from "../lib/letterCases";
import { encodeShare, decodeShare } from "../lib/share";
import { toast, Toaster } from "sonner";

const LRAR_URL = process.env.REACT_APP_LRAR_URL || "#";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payload, setPayload] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(null);
  const [shareText, setShareText] = useState(null); // present => read-only mode
  const [linkCopied, setLinkCopied] = useState(false);

  // Detect share token from URL FIRST
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("l");
    if (token) {
      const decoded = decodeShare(token);
      if (decoded) {
        setShareText(decoded);
        return;
      }
    }
    // Otherwise load from sessionStorage as before
    const raw = sessionStorage.getItem("clameo:result");
    if (!raw) {
      navigate("/builder");
      return;
    }
    try {
      setPayload(JSON.parse(raw));
    } catch {
      navigate("/builder");
    }
  }, [navigate, location.search]);

  const generatedText = useMemo(() => {
    if (!payload) return "";
    return buildLetter(payload.caseId, payload.data);
  }, [payload]);

  const isShareMode = shareText !== null;
  const baseText = isShareMode ? shareText : (editedText !== null ? editedText : generatedText);
  const isEdited = !isShareMode && editedText !== null && editedText !== generatedText;
  const c = payload ? getCase(payload.caseId) : null;

  // === Actions ===
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(baseText);
      setCopied(true);
      toast.success("Lettre copiée dans le presse-papiers");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handlePrint = () => window.print();

  const handlePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 56;
    const maxW = 595 - margin * 2;
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(baseText, maxW);
    let y = margin;
    const lineHeight = 14;
    lines.forEach((ln) => {
      if (y > 800) { doc.addPage(); y = margin; }
      doc.text(ln, margin, y);
      y += lineHeight;
    });
    const fileName = isShareMode ? "clameo-lettre.pdf" : `clameo-${payload.caseId}.pdf`;
    doc.save(fileName);
    toast.success("PDF téléchargé");
  };

  const handleShare = async () => {
    const token = encodeShare(baseText);
    const url = `${window.location.origin}/result?l=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success("Lien de partage copié");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const startEdit = () => { setEditedText(baseText); setEditing(true); };
  const stopEdit = () => setEditing(false);
  const resetEdit = () => {
    setEditedText(null); setEditing(false);
    toast.success("Texte réinitialisé");
  };

  // Loading guard
  if (!isShareMode && (!payload || !c)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-xl mx-auto py-32 text-center">
          <p className="text-foreground/60">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Header />

      <section className="max-w-[1100px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="no-print flex items-center justify-between mb-8">
          {isShareMode ? (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground" data-testid="result-back">
              <ArrowLeft size={16} /> Retour à l'accueil
            </Link>
          ) : (
            <Link to="/builder" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground" data-testid="result-back">
              <ArrowLeft size={16} /> Modifier ma lettre
            </Link>
          )}
          {!isShareMode && c && (
            <p className="eyebrow text-foreground/60 hidden sm:block">{c.title}</p>
          )}
          {isShareMode && (
            <p className="eyebrow text-foreground/60 hidden sm:block" data-testid="share-mode-badge">Lettre partagée — lecture seule</p>
          )}
        </div>

        <div className="no-print">
          <p className="eyebrow text-foreground/60">Votre lettre</p>
          <h1
            className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight"
            data-testid="result-title"
          >
            {isShareMode ? (
              <>Lettre <em className="italic">partagée</em></>
            ) : (
              <>Prête à <em className="italic">envoyer</em></>
            )}
          </h1>
          <p className="mt-4 text-foreground/70 max-w-xl">
            {isShareMode
              ? "Cette lettre vous a été partagée. Vous pouvez la copier, l'imprimer ou la télécharger."
              : "Relisez, ajustez le texte directement si nécessaire, puis téléchargez votre lettre."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Letter preview / editor */}
          <div className="lg:col-span-8">
            {!isShareMode && (
              <div className="no-print flex items-center gap-2 mb-3">
                {!editing ? (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border border-border hover:border-foreground transition"
                    data-testid="action-edit"
                  >
                    <Pencil size={14} /> Modifier le texte
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border border-border hover:border-foreground transition"
                    data-testid="action-preview"
                  >
                    <Eye size={14} /> Aperçu
                  </button>
                )}
                {isEdited && (
                  <button
                    type="button"
                    onClick={resetEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border border-border hover:border-foreground transition"
                    data-testid="action-reset"
                  >
                    <RotateCcw size={14} /> Réinitialiser
                  </button>
                )}
                {isEdited && (
                  <span className="text-xs text-trust font-medium" data-testid="edited-badge">
                    • Texte modifié
                  </span>
                )}
              </div>
            )}

            <div
              className="printable-letter relative bg-white rounded-sm letter-shadow overflow-hidden"
              data-testid="result-letter"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-coral" />

              {!isShareMode && editing ? (
                <textarea
                  value={baseText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-8 sm:p-12 font-mono-letter text-[13px] sm:text-[14px] leading-[1.7] text-foreground bg-white outline-none resize-none border-0 focus:ring-0"
                  style={{ minHeight: "70vh" }}
                  data-testid="result-editor"
                  spellCheck={true}
                />
              ) : (
                <pre className="p-8 sm:p-12 font-mono-letter text-[13px] sm:text-[14px] leading-[1.7] text-foreground whitespace-pre-wrap">
                  {baseText}
                </pre>
              )}
            </div>
          </div>

          {/* Actions sidebar */}
          <aside className="no-print lg:col-span-4 space-y-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-semibold text-xl">Actions</p>
              <p className="text-sm text-foreground/60 mt-1">Téléchargez, copiez ou partagez votre lettre.</p>

              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handlePDF}
                  className="btn-coral w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] text-sm font-semibold"
                  data-testid="action-pdf"
                >
                  <Download size={16} /> Télécharger en PDF
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] text-sm font-medium border border-border hover:border-foreground transition"
                  data-testid="action-copy"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  {copied ? "Copié !" : "Copier le texte"}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] text-sm font-medium border border-border hover:border-foreground transition"
                  data-testid="action-print"
                >
                  <Printer size={16} /> Imprimer
                </button>
                {!isShareMode && (
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] text-sm font-medium border border-border hover:border-foreground transition"
                    data-testid="action-share"
                  >
                    {linkCopied ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
                    {linkCopied ? "Lien copié !" : "Copier le lien de partage"}
                  </button>
                )}
              </div>
            </div>

            {/* LRAR — Et maintenant ? */}
            {!isShareMode && (
              <div className="rounded-lg border border-border bg-card p-6" data-testid="lrar-card">
                <p className="eyebrow text-foreground/50">Optionnel</p>
                <p className="font-semibold text-xl mt-2 leading-tight">
                  Envoyer votre lettre en recommandé
                </p>
                <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                  Votre courrier est prêt. Vous pouvez l'envoyer en recommandé avec accusé de réception via un service partenaire.
                </p>
                <a
                  href={LRAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-[14px] text-sm font-medium border border-border hover:bg-foreground hover:text-background transition"
                  data-testid="action-lrar"
                >
                  <Send size={14} /> Envoyer en LRAR <span aria-hidden>→</span>
                </a>
              </div>
            )}

            <div className="rounded-lg border border-border bg-secondary p-6">
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-trust shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Vie privée</p>
                  <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
                    Vos informations restent uniquement dans votre navigateur. Clameo ne les envoie pas à un serveur.
                  </p>
                </div>
              </div>
            </div>

            {!isShareMode && (
              <div className="rounded-lg border border-border bg-secondary p-6">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-trust shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Conseil pratique</p>
                    <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
                      Pour une mise en demeure, privilégiez l'envoi en lettre recommandée avec accusé de réception.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
