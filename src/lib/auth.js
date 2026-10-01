export const AUTH_TOKEN_KEY = "maboteAuthToken";
export const AUTH_EXPIRY_KEY = "maboteAuthExpiresAt";

const SESSION_DURATION_MS = 60 * 60 * 1000;
const PERMANENT_SESSION_DAYS = 36500;

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_EXPIRY_KEY);
}

export function saveAuthSession(token, keepLoggedIn = true, days = PERMANENT_SESSION_DAYS) {
  if (typeof window === "undefined") return;

  const expiryMs = keepLoggedIn
    ? Date.now() + days * 24 * 60 * 60 * 1000
    : Date.now() + SESSION_DURATION_MS;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_EXPIRY_KEY, String(expiryMs));
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = Number(window.localStorage.getItem(AUTH_EXPIRY_KEY) || 0);

  if (!token) {
    return null;
  }

  if (expiry && Date.now() > expiry) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
