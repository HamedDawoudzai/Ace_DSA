/**
 * Decode JWT payload (no signature verification — only for client-side expiry hints).
 */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(pad);
    if (typeof atob !== "function") return null;
    const json = atob(base64);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

/** True if access token is missing or expires within `skewMs` (default 2 min). */
export function accessTokenNeedsRefresh(
  accessToken: string | null,
  skewMs: number = 120_000
): boolean {
  if (!accessToken) return true;
  const payload = decodeJwtPayload(accessToken);
  if (payload?.exp == null) return false;
  const expMs = payload.exp * 1000;
  return Date.now() >= expMs - skewMs;
}
