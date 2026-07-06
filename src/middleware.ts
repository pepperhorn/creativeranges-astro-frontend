/* eslint-disable no-console */
import { defineMiddleware } from 'astro:middleware';
import { fetchRedirects, type AstroRedirect } from '@/lib/fetchRedirects';

const DIRECTUS_URL = import.meta.env.PUBLIC_DIRECTUS_URL as string;

// Redirects live in the CMS and can change without a redeploy, so we cache
// them in-memory with a short TTL instead of hitting Directus on every request.
const CACHE_TTL_MS = 60_000;

let cache: { map: Map<string, AstroRedirect>; expires: number } | null = null;

// Requests we should never treat as page routes (static assets, image endpoint).
const IGNORED_PREFIXES = ['/_astro/', '/_image', '/assets/', '/images/', '/fonts/', '/api/'];

function normalizePath(path: string): string {
  if (!path) return '/';
  let p = path.split('?')[0].split('#')[0];
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function normalizeDestination(dest: string): string {
  if (/^https?:\/\//i.test(dest)) return dest;
  return dest.startsWith('/') ? dest : `/${dest}`;
}

async function getRedirectMap(): Promise<Map<string, AstroRedirect>> {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.map;

  const redirects = await fetchRedirects(DIRECTUS_URL);
  const map = new Map<string, AstroRedirect>();
  for (const r of redirects) {
    map.set(normalizePath(r.source), r);
  }
  cache = { map, expires: now + CACHE_TTL_MS };

  return map;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const method = context.request.method;
  if (method !== 'GET' && method !== 'HEAD') return next();

  const { pathname, search } = context.url;
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return next();

  let map: Map<string, AstroRedirect>;
  try {
    map = await getRedirectMap();
  } catch (error) {
    console.error('[redirects] failed to load redirects, passing through', error);

    return next();
  }

  const match = map.get(normalizePath(pathname));
  if (!match) return next();

  const destination = normalizeDestination(match.destination);
  const isExternal = /^https?:\/\//i.test(destination);

  // Guard against self-redirect loops (e.g. a CMS row pointing a path at itself).
  if (!isExternal && normalizePath(destination) === normalizePath(pathname)) {
    return next();
  }

  // Preserve the query string on internal redirects.
  const target = isExternal ? destination : destination + search;

  return context.redirect(target, match.permanent ? 301 : 302);
});
