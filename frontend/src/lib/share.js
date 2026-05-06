// Share + draft helpers — purely client-side
const DRAFT_KEY = "clameo:draft";

// === SHARE LINK ===
// Encode the rendered letter text into a URL-safe base64 string.
// We share only the rendered text (not the form data) to minimise PII surface.

const utf8ToBase64 = (str) => {
  // Browser-safe UTF-8 -> base64
  return btoa(unescape(encodeURIComponent(str)));
};

const base64ToUtf8 = (b64) => {
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    return null;
  }
};

const toUrlSafe = (b64) => b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromUrlSafe = (s) => {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return b64;
};

export function encodeShare(text) {
  return toUrlSafe(utf8ToBase64(text));
}

export function decodeShare(token) {
  if (!token) return null;
  return base64ToUtf8(fromUrlSafe(token));
}

// === DRAFTS (localStorage) ===
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
