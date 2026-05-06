const RESULT_KEY = "clameo:result";

export const setResult = (v) => {
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

export const getResult = () => {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearResult = () => {
  try {
    sessionStorage.removeItem(RESULT_KEY);
  } catch {
    /* ignore */
  }
};