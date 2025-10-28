export function isActivePath(asPath: string, base: string) {
  const path = asPath.split(/[?#]/)[0].replace(/\/+$/, "");
  const baseNorm = base.replace(/\/+$/, "");

  if (path === baseNorm) return true;

  const segments = baseNorm.split("/").filter(Boolean).length;

  if (segments >= 3) {
    return path.startsWith(baseNorm + "/");
  }

  return false;
}
