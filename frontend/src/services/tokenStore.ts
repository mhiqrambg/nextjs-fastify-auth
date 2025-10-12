// Single source of truth token override (in-memory)
// Dipakai setelah refresh supaya request berikutnya langsung pakai token baru.
let accessTokenOverride: string | null = null;

export function setAccessTokenOverride(token: string | null) {
  accessTokenOverride = token;
}

export function getAccessTokenOverride(): string | null {
  return accessTokenOverride;
}
