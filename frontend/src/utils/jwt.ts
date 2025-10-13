// Minimal JWT utility functions for token validation

interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token to get payload
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Get token expiry time in milliseconds
 * @param token - JWT token string
 * @returns Expiry timestamp in ms, or null if not available
 */
export function getTokenExpiry(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;

  return payload.exp * 1000; // Convert to milliseconds
}

/**
 * Check if token is already expired
 * @param token - JWT token string
 * @returns true if token is expired
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;

  const expiry = getTokenExpiry(token);
  if (!expiry) return true;

  return Date.now() >= expiry;
}
