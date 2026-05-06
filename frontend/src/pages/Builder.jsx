import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Save, Trash2, Lock } from "lucide-react";
import { toast, Toaster } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CASES, CASE_STEPS, RECIPIENT_STEP, USER_STEP, getCase } from "../lib/letterCases";
import { saveDraft, loadDraft, clearDraft } from "../lib/share";

function FieldRenderer({ field, value, onChange }) {
  const base =
    "w-full px-4 py-3 bg-card border border-ink/20 rounded-md focus:border-ink focus:outline-none transition text-ink placeholder:text-ink/40";

  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        className={base}
        value={value || ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        data-testid={`field-${field.name}`}
      />
    );
  }
  if (field.type === "select") {
    // Find current slug for the stored label
    const currentSlug =
      (field.options.find((o) => o.label === value) || {}).value || "";
    return (
      <select
        className={base}
        value={currentSlug}
        onChange={(e) => {
          const slug = e.target.value;
          const opt = field.options.find((o) => o.value === slug);
          // Store the human-readable label so letter templates stay clean
          onChange(field.name, opt ? opt.label : "");
        }}
        data-testid={`field-${field.name}`}
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
    );
  }
  return (
    <input
      type={field.type || "text"}
      className={base}
      value={value || ""}
      placeholder={field.placeholder}
      onChange={(e) => onChange(field.name, e.target.value)}
      data-testid={`field-${field.name}`}
    />
  );
}

export default function Builder() {
  const { caseType } = useParams();
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState(caseType || null);
  const [data, setData] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [hasDraftForCase, setHasDraftForCase] = useState(false);

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
    return [...(CASE_STEPS[selectedCase] || []), RECIPIENT_STEP, USER_STEP];
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
    if (!isStepValid()) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Persist + navigate to result
      sessionStorage.setItem("clameo:result", JSON.stringify({ caseId: selectedCase, data }));
      navigate("/result");
    }
  };

  const prev = () => {
    if (stepIndex === 0) {
      setSelectedCase(null);
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
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <section className="max-w-[1100px] mx-auto px-6 lg:px-12 py-16 lg:py-24" data-testid="builder-picker">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink mb-8" data-testid="back-home">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
          <p className="eyebrow text-ink/60">Étape 1</p>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight">
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
                    setStepIndex(0);
                    navigate(`/builder/${cs.id}`);
                  }}
                  className="use-card text-left flex items-start gap-5 p-6 rounded-md border border-ink/15 bg-card"
                  data-testid={`pick-${cs.id}`}
                >
                  <div className="shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-md border border-ink/15 bg-paper-2">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="font-serif-display text-[20px] leading-tight">{cs.title}</p>
                    <p className="text-sm text-ink/60 mt-1.5">{cs.short}</p>
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
    <div className="min-h-screen bg-paper text-ink">
      <Toaster position="top-center" />
      <Header />
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-12 lg:py-20" data-testid="builder-form">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
            data-testid="builder-prev"
          >
            <ArrowLeft size={16} />
            {stepIndex === 0 ? "Changer de situation" : "Précédent"}
          </button>
          <p className="text-sm text-ink/60" data-testid="builder-step-count">
            Étape {stepIndex + 1} / {totalSteps}
          </p>
        </div>

        <div className="h-[3px] bg-ink/10 rounded-full overflow-hidden" data-testid="builder-progress">
          <div
            className="h-full bg-amber-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-10">
          <p className="eyebrow text-ink/60">{c.title}</p>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl mt-3 leading-[1.05] tracking-tight">
            {currentStep.title}
          </h1>
        </div>

        <div className="mt-10 space-y-6">
          {currentStep.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink/80" htmlFor={f.name}>
                {f.label}
                {f.required ? <span className="text-amber-brand"> *</span> : null}
              </label>
              <FieldRenderer field={f} value={data[f.name]} onChange={handleChange} />
            </div>
          ))}
        </div>

        {/* Privacy + explicit draft actions */}
        <div className="mt-10 rounded-md border border-ink/10 bg-paper-2 p-5" data-testid="draft-panel">
          <div className="flex items-start gap-3">
            <Lock size={16} className="text-sage shrink-0 mt-0.5" />
            <p className="text-xs text-ink/70 leading-relaxed">
              Vos informations restent uniquement dans votre navigateur. Clameo ne les envoie pas à un serveur.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-ink/20 hover:border-ink transition"
              data-testid="draft-save"
            >
              <Save size={14} /> Sauvegarder ce brouillon sur cet appareil
            </button>
            {hasDraftForCase && (
              <>
                <button
                  type="button"
                  onClick={onRestoreDraft}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-ink/20 hover:border-ink transition"
                  data-testid="draft-restore"
                >
                  Reprendre mon brouillon
                </button>
                <button
                  type="button"
                  onClick={onClearDraft}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-ink/20 hover:border-ink/60 text-ink/60 hover:text-ink transition"
                  data-testid="draft-clear"
                >
                  <Trash2 size={14} /> Effacer mes données
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-8">
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-ink/20 hover:border-ink transition"
            data-testid="builder-back"
          >
            <ArrowLeft size={16} /> Précédent
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!isStepValid()}
            className="btn-amber inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            data-testid="builder-next"
          >
            {stepIndex === totalSteps - 1 ? (
              <>
                Générer ma lettre <Check size={16} />
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
