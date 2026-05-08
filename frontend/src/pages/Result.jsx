import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Copy, Download, Printer, Check, FileText,
  Pencil, RotateCcw, Eye, Lock,
} from "lucide-react";
import jsPDF from "jspdf";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { buildLetter } from "../lib/letterTemplates";
import { getCase } from "../lib/letterCases";
import { getResult } from "../lib/resultStore";
import { toast, Toaster } from "sonner";

const LRAR_URL = process.env.REACT_APP_LRAR_URL || "";

export default function Result() {
  const [payload, setPayload] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(null);

  // Load from result store
  useEffect(() => {
    const result = getResult();
    setPayload(result || null);
  }, []);

  const generatedText = useMemo(() => {
    if (!payload) return "";

    try {
      return buildLetter(payload.caseId, payload.data);
    } catch (error) {
      console.error(error);
      return "";
    }
  }, [payload]);

  const baseText = editedText !== null ? editedText : generatedText;
  const isEdited = editedText !== null && editedText !== generatedText;
  const c = payload ? getCase(payload.caseId) : null;

  // === Actions ===
  const handleCopy = async () => {
    if (!baseText.trim()) {
      toast.error("La lettre est vide. Veuillez revenir au générateur.");
      return;
    }
    try {
      await navigator.clipboard.writeText(baseText);
      setCopied(true);
      toast.success("Lettre copiée dans le presse-papiers");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handlePrint = () => {
  if (!baseText.trim()) {
    toast.error("La lettre est vide. Veuillez revenir au générateur.");
    return;
  }

  window.print();
};

  const handlePDF = () => {
    if (!baseText.trim()) {
      toast.error("La lettre est vide. Veuillez revenir au générateur.");
      return;
    }
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 56;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxW = pageWidth - margin * 2;
    const lineHeight = 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);

    const lines = doc.splitTextToSize(baseText, maxW);
    let y = margin;

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.text(line, margin, y);
      y += lineHeight;
    });

    const fileName = `clameo-${payload.caseId}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    toast.success("PDF téléchargé");
  };

  const startEdit = () => { setEditedText(baseText); setEditing(true); };
  const stopEdit = () => setEditing(false);
  const resetEdit = () => {
    setEditedText(null); setEditing(false);
    toast.success("Texte réinitialisé");
  };

  // Fallback guard
  if (!payload || !c) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-center" />
        <Header />
        <section className="max-w-xl mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] mb-4">
            Votre lettre n'est plus disponible
          </h1>
          <p className="text-foreground/70 mb-8">
            Retournez au générateur pour créer une nouvelle lettre.
          </p>
          <Link
            to="/builder"
            className="btn-coral inline-flex items-center gap-2 px-6 py-3 rounded-[14px] text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Créer une lettre
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />
      <Header />

      <section className="max-w-[1100px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="no-print flex items-center justify-between mb-8">
          <Link to="/builder" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground" data-testid="result-back">
            <ArrowLeft size={16} /> Modifier ma lettre
          </Link>
          {c && (
            <p className="eyebrow text-foreground/60 hidden sm:block">{c.title}</p>
          )}
        </div>

        <div className="no-print">
          <p className="eyebrow text-foreground/60">Votre lettre</p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]"
            data-testid="result-title"
          >
            Prêt à <em className="italic text-[#e8502a]">envoyer</em>
          </h1>
          <p className="mt-4 text-foreground/70 max-w-xl">
            Relisez, ajustez le texte directement si nécessaire, puis téléchargez votre lettre.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Letter preview / editor */}
          <div className="lg:col-span-8">
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
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
                  style={{ borderColor: "#e5e7eb", color: "#e8502a" }}
                  data-testid="edited-badge"
                >
                  Modifié
                </span>
              )}
            </div>

            <div
              className="printable-letter relative bg-white rounded-sm letter-shadow overflow-hidden"
              data-testid="result-letter"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-coral" />

              {editing ? (
                <textarea
                  value={baseText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-6 sm:p-9 font-mono-letter text-[13px] sm:text-[14px] leading-[1.7] text-foreground bg-white outline-none resize-none border-0 focus:ring-0"
                  style={{ minHeight: "70vh" }}
                  data-testid="result-editor"
                  spellCheck={true}
                />
              ) : (
                <pre className="p-6 sm:p-9 font-mono-letter text-[13px] sm:text-[14px] leading-[1.7] text-foreground whitespace-pre-wrap">
                  {baseText}
                </pre>
              )}
            </div>

            {/* Attachments section */}
            {payload?.data?.uploadedAttachments && payload.data.uploadedAttachments.length > 0 && (
              <div className="no-print mt-8 rounded-lg border border-border bg-card p-6">
                <p className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-coral" />
                  Pièces jointes
                </p>
                <div className="space-y-3">
                  {payload.data.uploadedAttachments.map((attachment, index) => (
                    <div
                      key={attachment.id || index}
                      className="flex items-center justify-between p-3 rounded-[14px] bg-white border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                          <FileText size={20} className="text-coral" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{attachment.fileName || attachment.name || `Fichier ${index + 1}`}</p>
                          <p className="text-xs text-foreground/60">
                            {attachment.fileSize ? `${(attachment.fileSize / 1024 / 1024).toFixed(2)} Mo` : 'PDF'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={attachment.fileUrl || attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-coral hover:underline"
                        download
                      >
                        Télécharger
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground/60 mt-4">
                  Ces fichiers servent à préparer votre dossier. Ils ne sont pas envoyés automatiquement au destinataire.
                </p>
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <aside className="no-print lg:col-span-4 space-y-3 mt-6 lg:mt-0">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-semibold text-xl">Actions</p>
              <p className="text-sm text-foreground/60 mt-1">Téléchargez, copiez ou imprimez votre lettre.</p>

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
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
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

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm font-semibold">Envoyer en recommandé</p>
              <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">
                Votre lettre est prête. Vous pouvez l'envoyer en recommandé avec accusé de réception via un service d'envoi en ligne.
              </p>

              {LRAR_URL ? (
                <a
                  href={LRAR_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-[14px] text-sm font-semibold border border-border hover:border-foreground transition"
                >
                  Envoyer en recommandé →
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-[14px] text-sm font-semibold border border-border opacity-50 cursor-not-allowed"
                >
                  Partenaire bientôt disponible
                </button>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
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
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
