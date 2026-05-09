import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Lock, AlertTriangle, Lightbulb } from "lucide-react";
import { toast, Toaster } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CASES, CASE_STEPS, RECIPIENT_STEP, ATTACHMENTS_STEP, USER_STEP, getCase } from "../lib/letterCases";
import { validateLetterData } from "../lib/letterTemplates";
import { setResult } from "../lib/resultStore";

const token = {
  light: "#fbfaf7",
  text: "#111827",
  coral: "#e8502a",
  border: "#e5e7eb",
  muted: "#6b7280",
  white: "#ffffff",
};

function InjectBuilderStyles() {
  return (
    <style>{`
      .builder-section {
        background: ${token.light};
        color: ${token.text};
        font-family: 'DM Sans', system-ui, sans-serif;
      }
      .builder-eyebrow {
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: ${token.coral};
        margin-bottom: 8px;
      }
    `}</style>
  );
}

function FileUploadField({ field, value, onChange, data, setData, uploadFile, deleteFile, caseSessionId }) {
  const [uploading, setUploading] = useState(false);
  const uploadedFiles = value || [];
  const sessionReady = !!caseSessionId;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];

    // Validate file size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Le fichier dépasse la limite de 10 Mo');
      return;
    }

    // Validate file type
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      toast.error('Type de fichier non autorisé. Formats acceptés : PDF, PNG, JPG, DOC, DOCX');
      return;
    }

    setUploading(true);
    try {
      await uploadFile(file);
    } finally {
      setUploading(false);
    }
    // Reset input
    e.target.value = '';
  };

  const handleFileDelete = async (attachmentId, fileName) => {
    try {
      await deleteFile(attachmentId);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-border rounded-[14px] p-6">
        <div className="text-center">
          <input
            type="file"
            id={`field-${field.name}`}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={handleFileUpload}
            disabled={!sessionReady || uploading}
            className="hidden"
            data-testid={`field-${field.name}`}
          />

          <label
            htmlFor={`field-${field.name}`}
            className={`cursor-pointer flex flex-col items-center justify-center gap-3 text-foreground/70 hover:text-foreground transition ${!sessionReady || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
              {uploading ? (
                <svg className="w-6 h-6 text-coral animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">
              {!sessionReady ? 'Initialisation...' : uploading ? 'Téléchargement en cours...' : 'Ajouter un fichier'}
            </span>
            <span className="text-xs">PDF, PNG, JPG, DOC ou DOCX — 10 Mo maximum par fichier.</span>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Fichiers téléchargés:</p>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-coral/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.file_name}</p>
                    <p className="text-xs text-foreground/60">{(file.file_size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileDelete(file.id, file.file_name)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {field.helper && (
        <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
          {field.helper}
        </p>
      )}
      <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
        Ces fichiers servent uniquement à préparer votre dossier. Ils ne sont pas envoyés automatiquement au destinataire.
      </p>
    </div>
  );
}

function FieldRenderer({ field, value, onChange, attempted, data, setData, uploadFile, deleteFile, caseSessionId, uploadedFiles }) {
  const base = "w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999]";
  const isInvalid = attempted && field.required && !value;

  if (field.type === "textarea") {
    return (
      <div>
        <textarea
          id={`field-${field.name}`}
          rows={4}
          className={base}
          value={value || ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
          data-testid={`field-${field.name}`}
          style={{ borderColor: isInvalid ? token.coral : token.border }}
          onFocus={(e) => e.target.style.borderColor = token.coral}
          onBlur={(e) => e.target.style.borderColor = token.border}
        />
        {field.helper && (
          <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
            {field.helper}
          </p>
        )}
      </div>
    );
  }
  if (field.type === "select") {
    // Find current slug for the stored label
    const currentSlug =
      (field.options.find((o) => o.label === value) || {}).value || "";
    return (
      <div>
        <select
          id={`field-${field.name}`}
          className={base}
          value={currentSlug}
          onChange={(e) => {
            const slug = e.target.value;
            const opt = field.options.find((o) => o.value === slug);
            // Store the human-readable label so letter templates stay clean
            onChange(field.name, opt ? opt.label : "");
          }}
          data-testid={`field-${field.name}`}
          style={{ borderColor: isInvalid ? token.coral : token.border }}
          onFocus={(e) => e.target.style.borderColor = token.coral}
          onBlur={(e) => e.target.style.borderColor = token.border}
        >
          <option value="" disabled>
            — Sélectionnez —
          </option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.helper && (
          <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
            {field.helper}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "checkboxGroup") {
    const selectedValues = value || [];

    return (
      <div>
        <div className="space-y-3">
          {field.options.map((option) => (
            <label key={option.value} htmlFor={`${field.name}-${option.value}`} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id={`${field.name}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange(field.name, [...selectedValues, option.value]);
                  } else {
                    onChange(field.name, selectedValues.filter(v => v !== option.value));
                  }
                }}
                className="w-4 h-4 text-coral border border-border rounded focus:outline-none focus:ring-2 focus:ring-coral/20"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
        {field.helper && (
          <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
            {field.helper}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "fileUpload") {
    return <FileUploadField field={field} value={uploadedFiles} onChange={onChange} data={data} setData={setData} uploadFile={uploadFile} deleteFile={deleteFile} caseSessionId={caseSessionId} />;
  }

  return (
    <div>
      <input
        id={`field-${field.name}`}
        type={field.type || "text"}
        className={base}
        value={value || ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        data-testid={`field-${field.name}`}
        style={{ borderColor: isInvalid ? token.coral : token.border }}
        onFocus={(e) => e.target.style.borderColor = token.coral}
        onBlur={(e) => e.target.style.borderColor = token.border}
        {...(field.type === "date" && {
          min: "1900-01-01",
          max: new Date().toISOString().split("T")[0],
        })}
      />
      {field.helper && (
        <p className="mt-2 text-xs text-foreground/60" style={{ paddingLeft: "16px" }}>
          {field.helper}
        </p>
      )}
    </div>
  );
}

export default function Builder() {
  const { caseType } = useParams();
  const navigate = useNavigate();

  const [selectedCase, setSelectedCase] = useState(() =>
    caseType && getCase(caseType) ? caseType : null
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [caseSessionId, setCaseSessionId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // NOUVEAU : Déterminer si ce litige exige une LRAR
  const requiresLRAR =
  selectedCase && ["mise-en-demeure", "logement", "employeur"].includes(selectedCase);

  const isCafCase = selectedCase === "caf-reclamation";
  // If no case selected, show case picker
  const c = selectedCase ? getCase(selectedCase) : null;
  useEffect(() => {
    if (caseType && getCase(caseType)) {
      setSelectedCase(caseType);
      setStepIndex(0);
      setData({});
      setUploadedFiles([]);
      setCaseSessionId(null);
    }
  }, [caseType]);

  const allSteps = useMemo(() => {
    if (!selectedCase) return [];
    return [...(CASE_STEPS[selectedCase] || []), RECIPIENT_STEP, ATTACHMENTS_STEP, USER_STEP];
  }, [selectedCase]);

  const totalSteps = allSteps.length;
  const currentStep = allSteps[stepIndex];
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const handleChange = (name, val) => setData((d) => ({ ...d, [name]: val }));

  const isStepValid = () => {
    if (!currentStep) return false;
    return currentStep.fields.every((f) => !f.required || (data[f.name] && String(data[f.name]).trim()));
  };


  const createCaseSession = useCallback(async () => {
    if (!selectedCase) {
      toast.error('Veuillez d\'abord sélectionner un type de dossier');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/case-session-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ caseId: selectedCase }),
      });

      const result = await response.json();
      if (result.ok) {
        setCaseSessionId(result.caseSessionId);
        setData(prev => ({ ...prev, caseSessionId: result.caseSessionId }));
      } else {
        toast.error(result.error || 'Erreur lors de la création de session');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      toast.error('Erreur lors de la création de session');
    }
  }, [selectedCase]);

  const uploadFile = async (file) => {
    if (!caseSessionId) {
      toast.error('Session non initialisée');
      return;
    }

    const formData = new FormData();
    formData.append('caseSessionId', caseSessionId);
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/attachment-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.ok) {
        setUploadedFiles(prev => [...prev, result.attachment]);
        // Update data with uploaded attachments
        setData(prev => ({
          ...prev,
          uploadedAttachments: [...(prev.uploadedAttachments || []), result.attachment]
        }));
        toast.success('Fichier téléchargé avec succès');
      } else {
        toast.error(result.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const deleteFile = async (attachmentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/attachment-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ caseSessionId, attachmentId }),
      });

      const result = await response.json();
      if (result.ok) {
        setUploadedFiles(prev => prev.filter(f => f.id !== attachmentId));
        // Update data by removing from uploadedAttachments
        setData(prev => ({
          ...prev,
          uploadedAttachments: (prev.uploadedAttachments || []).filter(f => f.id !== attachmentId)
        }));
        toast.success('Fichier supprimé');
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    createCaseSession();
  }, [selectedCase, createCaseSession]);


  const next = () => {
    if (!isStepValid()) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // Final validation before generating
      const missing = validateLetterData(selectedCase, data);
      if (missing.length > 0) {
        toast.error("Certaines informations obligatoires sont manquantes.");
        return;
      }

      // Persist + navigate to result
      setResult({ caseId: selectedCase, data });
      navigate("/result");
    }
  };

  const prev = () => {
    if (stepIndex === 0) {
      setSelectedCase(null);
      setData({});
      setStepIndex(0);
      navigate("/builder");
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stepIndex, selectedCase]);


  // CASE PICKER
  if (!c) {
    return (
      <div className="min-h-screen builder-section">
        <InjectBuilderStyles />
        <Header />
        <section className="max-w-[1100px] mx-auto px-6 lg:px-12 py-16 lg:py-24" data-testid="builder-picker">
          <Link to="/" className="inline-flex items-center gap-2 text-sm hover:text-[#111827] mb-8" style={{ color: token.muted }} data-testid="back-home">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
          <p className="builder-eyebrow">Étape 1</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
            Choisissez votre <em className="italic">situation</em>
          </h1>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CASES.map((cs) => {
              const Icon = cs.Icon;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => {
                    setSelectedCase(cs.id);
                    setData({});
                    setStepIndex(0);
                    navigate(`/builder/${cs.id}`);
                  }}
                  className="use-card text-left flex items-start gap-5 p-6 rounded-[16px] border bg-white"
                  style={{ borderColor: token.border }}
                  data-testid={`pick-${cs.id}`}
                >
                  <Icon size={20} strokeWidth={1.6} style={{ color: token.text }} />
                  <div>
                    <p className="text-[20px] leading-tight font-bold tracking-tight">{cs.title}</p>
                    <p className="text-sm mt-1.5" style={{ color: token.muted }}>{cs.short}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // STEP FORM
  return (
    <div className="min-h-screen builder-section">
      <InjectBuilderStyles />
      <Toaster position="top-center" />
      <Header />
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-12 lg:py-20" data-testid="builder-form">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: token.muted }}
            data-testid="builder-prev"
          >
            <ArrowLeft size={16} />
            {stepIndex === 0 ? "Changer de situation" : "Précédent"}
          </button>
          <p className="text-sm" style={{ color: token.muted }} data-testid="builder-step-count">
            Étape {stepIndex + 1} / {totalSteps}
          </p>
        </div>

        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: token.border }} data-testid="builder-progress">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: token.coral }}
          />
        </div>

        <div className="mt-10">
          <p className="builder-eyebrow">{c.title}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
            {currentStep.title}
          </h1>
        </div>

        {/* CAF-specific advisory */}
        {selectedCase === "caf-reclamation" && (
          <div className="mt-6 rounded-[12px] border p-4" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <p className="text-xs leading-relaxed" style={{ color: token.muted }}>
              <span style={{ color: '#166534', fontWeight: 600 }}>Clameo n'est pas affilié à la CAF.</span> Cette lettre vous aide à formuler une réclamation ou une demande d'explication de manière claire. Pour une contestation officielle, un recours ou une dette CAF, vérifiez toujours les délais et les indications figurant sur votre courrier CAF.
            </p>
          </div>
        )}

        <div className="mt-10 space-y-6">
          {currentStep.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: token.text }} htmlFor={`field-${f.name}`}>
                {f.label}
                {f.required ? <span style={{ color: token.coral }}> *</span> : null}
              </label>
              <FieldRenderer field={f} value={data[f.name]} onChange={handleChange} attempted={attempted} data={data} setData={setData} uploadFile={uploadFile} deleteFile={deleteFile} caseSessionId={caseSessionId} uploadedFiles={uploadedFiles} />
            </div>
          ))}
        </div>

        {/* Sending advice */}
        {stepIndex === 0 && (
          <div
            className="mt-10 rounded-[16px] border p-5"
            style={{
              background: requiresLRAR ? "#fff8f6" : "#fffbeb",
              borderColor: requiresLRAR ? "#fcd6cf" : "#fde68a",
            }}
          >
            <div className="flex items-start gap-3">
              {requiresLRAR ? (
                <AlertTriangle
                  size={18}
                  style={{ color: token.coral, flexShrink: 0, marginTop: 2 }}
                />
              ) : (
                <Lightbulb
                  size={18}
                  className="text-amber-600"
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
              )}

              <div>
                <p className="text-sm font-bold" style={{ color: token.text }}>
                  {isCafCase
                    ? "Conseil : gardez une trace de votre demande"
                    : requiresLRAR
                      ? "Conseil : conserver une preuve d’envoi"
                      : "Conseil d’envoi"}
                </p>

                <p className="text-xs leading-relaxed mt-1" style={{ color: token.text }}>
                  {isCafCase
                    ? "Pour une réclamation CAF simple, privilégiez un ton clair, factuel et coopératif. Conservez une copie de votre courrier, des pièces jointes et de toute preuve de dépôt, d’envoi ou de message transmis depuis votre espace CAF."
                    : requiresLRAR
                      ? "Pour ce type de démarche, une preuve d’envoi peut être importante. Vous pouvez envisager un envoi en Lettre Recommandée avec Accusé de Réception (LRAR), selon votre situation."
                      : "Votre dossier final peut souvent être envoyé par email ou par courrier classique. Le recommandé (LRAR) peut être utile en cas de litige persistant ou si vous souhaitez conserver une preuve renforcée."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy notice */}
        <div className="mt-4 rounded-[16px] border p-5" style={{ background: token.white, borderColor: token.border }}>
          <div className="flex items-start gap-3">
            <Lock size={16} style={{ color: token.coral, flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: token.muted }}>
              Vos informations servent à préparer votre lettre et votre dossier. Une partie du
              traitement reste locale dans votre navigateur ; si vous ajoutez des pièces
              jointes, elles sont stockées temporairement pour permettre la génération du
              dossier, puis supprimées automatiquement au plus tard 7 jours après leur création.
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between pt-8" style={{ borderTop: `1px solid ${token.border}` }}>
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[14px] text-sm font-medium border transition"
            style={{ borderColor: token.border }}
            data-testid="builder-back"
          >
            <ArrowLeft size={16} /> Précédent
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!isStepValid()}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: token.coral, color: token.white }}
            data-testid="builder-next"
          >
            {stepIndex === totalSteps - 1 ? (
              <>
                Préparer mon dossier<Check size={16} />
              </>
            ) : (
              <>
                Continuer <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}