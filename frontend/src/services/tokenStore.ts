// Single source of truth token override (persisted in sessionStorage)
// Dipakai setelah refresh supaya request berikutnya langsung pakai token baru.
const TOKEN_OVERRIDE_KEY = "accessTokenOverride";

export function setAccessTokenOverride(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    sessionStorage.setItem(TOKEN_OVERRIDE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_OVERRIDE_KEY);
  }
}

export function getAccessTokenOverride(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_OVERRIDE_KEY);
}

/**
 * Clear token override from sessionStorage
 * Used to cleanup expired tokens on app initialization
 */
export function clearAccessTokenOverride() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_OVERRIDE_KEY);
}
