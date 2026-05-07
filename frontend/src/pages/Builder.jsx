import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Save, Trash2, Lock } from "lucide-react";
import { toast, Toaster } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CASES, CASE_STEPS, RECIPIENT_STEP, ATTACHMENTS_STEP, USER_STEP, getCase } from "../lib/letterCases";
import { validateLetterData } from "../lib/letterTemplates";
import { saveDraft, loadDraft, clearDraft } from "../lib/share";
import { setResult } from "../lib/resultStore";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-instance.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabaseSecret = 'your-supabase-secret';
const supabase = createClient(supabaseUrl, supabaseKey, supabaseSecret);

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

function FieldRenderer({ field, value, onChange, attempted }) {
  const base = "w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999]";
  const isInvalid = attempted && field.required && !value;

  if (field.type === "textarea") {
    return (
      <div>
        <textarea
          id={field.name}
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
          id={field.name}
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
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id={option.value}
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
    const uploadedFiles = value || [];
    
    return (
      <div>
        <div className="border-2 border-dashed border-border rounded-[14px] p-6">
          <div className="text-center">
            <input
              type="file"
              id={field.name}
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                  onChange(field.name, [...uploadedFiles, ...files]);
                }
              }}
              className="hidden"
              data-testid={`field-${field.name}`}
            />
            
            <label
              htmlFor={field.name}
              className="cursor-pointer flex flex-col items-center justify-center gap-3 text-foreground/70 hover:text-foreground transition"
            >
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 0 1 4 4 0 1-4 4-4zm0 0h14a7 7 0 0 1 7 7 0 1-7-7-7h-1v10h-2v-10h-1z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Cliquez pour télécharger des fichiers</span>
              <span className="text-xs">PDF, PNG, JPG, DOC, DOCX (max 10 MB)</span>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-foreground/60">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = uploadedFiles.filter((_, i) => i !== index);
                      onChange(field.name, newFiles);
                    }}
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
      </div>
    );
  }

  return (
    <div>
      <input
        id={field.name}
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
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCase, setSelectedCase] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [hasDraftForCase, setHasDraftForCase] = useState(false);
  const [caseSessionId, setCaseSessionId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // If no case selected, show case picker
  const c = selectedCase ? getCase(selectedCase) : null;
  useEffect(() => {
    if (caseType && getCase(caseType)) setSelectedCase(caseType);
  }, [caseType]);

  // On selectedCase change, check if a draft exists for this case (no auto-load)
  useEffect(() => {
    if (!selectedCase) {
      setHasDraftForCase(false);
      return;
    }
    const d = loadDraft();
    setHasDraftForCase(!!(d && d.caseId === selectedCase));
  }, [selectedCase]);

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

  // EXPLICIT actions
  const onSaveDraft = () => {
    saveDraft(selectedCase, data, stepIndex);
    setHasDraftForCase(true);
    toast.success("Brouillon sauvegardé sur cet appareil");
  };

  const onClear = () => {
    clearDraft();
    setHasDraftForCase(false);
    toast.success("Données effacées de cet appareil");
  };

  const createCaseSession = async () => {
    if (!caseSessionId && selectedCase) {
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
        } else {
          toast.error('Erreur lors de la création de session');
        }
      } catch (error) {
        console.error('Session creation error:', error);
        toast.error('Erreur lors de la création de session');
      }
    }
  };

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
        body: JSON.stringify({ attachmentId }),
      });

      const result = await response.json();
      if (result.ok) {
        setUploadedFiles(prev => prev.filter(f => f.id !== attachmentId));
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
  }, [selectedCase]);

  const onRestoreDraft = () => {
    const d = loadDraft();
    if (!d || d.caseId !== selectedCase) {
      toast.error("Aucun brouillon disponible");
      return;
    }
    setData(d.data || {});
    setStepIndex(Math.min(d.stepIndex || 0, totalSteps - 1));
    toast.success("Brouillon restauré");
  };

  const onClearDraft = () => {
    clearDraft();
    setHasDraftForCase(false);
    toast.success("Données effacées de cet appareil");
  };

  const next = () => {
    if (!isStepValid()) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

        <div className="mt-10 space-y-6">
          {currentStep.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: token.text }} htmlFor={f.name}>
                {f.label}
                {f.required ? <span style={{ color: token.coral }}> *</span> : null}
              </label>
              <FieldRenderer field={f} value={data[f.name]} onChange={handleChange} attempted={attempted} />
            </div>
          ))}
        </div>

        {/* Privacy + explicit draft actions */}
        <div className="mt-10 rounded-[16px] border p-5" style={{ background: token.white, borderColor: token.border }} data-testid="draft-panel">
          <div className="flex items-start gap-3">
            <Lock size={16} style={{ color: token.coral, flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: token.muted }}>
              Vos informations restent uniquement dans votre navigateur. Clameo ne les envoie pas à un serveur.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border transition"
              style={{ borderColor: token.border }}
              data-testid="draft-save"
            >
              <Save size={14} /> Sauvegarder ce brouillon sur cet appareil
            </button>
            {hasDraftForCase && (
              <>
                <button
                  type="button"
                  onClick={onRestoreDraft}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border transition"
                  style={{ borderColor: token.border }}
                  data-testid="draft-restore"
                >
                  Reprendre mon brouillon
                </button>
                <button
                  type="button"
                  onClick={onClearDraft}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-medium border transition"
                  style={{ borderColor: token.border, color: token.muted }}
                  data-testid="draft-clear"
                >
                  <Trash2 size={14} /> Effacer mes données
                </button>
              </>
            )}
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
                Générer ma lettre prête à envoyer <Check size={16} />
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