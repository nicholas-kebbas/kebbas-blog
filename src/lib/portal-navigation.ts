/** Keep a normal link a normal link unless this exact activation can use the portal. */
export interface PortalActivation {
  button: number;
  defaultPrevented?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  target?: string | null;
  download?: boolean;
}

export type PortalDestination =
  { kind: "anchor"; url: URL; id: string } | { kind: "page"; url: URL };

export function isPlainPortalActivation(activation: PortalActivation): boolean {
  return (
    activation.button === 0 &&
    !activation.defaultPrevented &&
    !activation.altKey &&
    !activation.ctrlKey &&
    !activation.metaKey &&
    !activation.shiftKey &&
    !activation.download &&
    (!activation.target || activation.target.toLowerCase() === "_self")
  );
}

export function resolvePortalDestination(
  href: string,
  currentHref: string,
): PortalDestination | null {
  if (!href.trim()) return null;
  try {
    const url = new URL(href, currentHref);
    const current = new URL(currentHref);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.href === current.href) return null;
    if (
      url.origin === current.origin &&
      url.pathname === current.pathname &&
      url.search === current.search &&
      url.hash
    ) {
      return { kind: "anchor", url, id: decodeURIComponent(url.hash.slice(1)) };
    }
    return { kind: "page", url };
  } catch {
    return null;
  }
}
