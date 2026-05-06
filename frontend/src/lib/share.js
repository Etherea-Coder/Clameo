// Draft helpers — purely client-side
const DRAFT_KEY = "clameo:draft";

export function saveDraft(caseId, data, stepIndex) {
  if (!caseId) return;
  try {
    const payload = {
      caseId,
      data,
      stepIndex,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage unavailable */
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
