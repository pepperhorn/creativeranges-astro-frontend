// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || '';
const directusHost = directusUrl?.split('//')[1];

const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

// Get output mode from environment variable, default to 'server' for development
const outputMode = process.env.ASTRO_OUTPUT || 'server';

// Redirects live in the CMS `redirects` collection. The site is prerendered and
// served statically, so request-time middleware never runs for path misses —
// build them into Astro's native `redirects` so real redirect artifacts ship.
function normalizeRedirectPath(path: string): string {
  if (!path) return '/';
  let p = path.split('?')[0].split('#')[0];
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

async function loadCmsRedirects(): Promise<Record<string, { status: 301 | 302; destination: string }>> {
  const base =
    process.env.PUBLIC_DIRECTUS_URL ||
    process.env.DIRECTUS_URL ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    '';
  if (!base) {
    console.warn('[redirects] no Directus URL at config load; skipping');

    return {};
  }

  try {
    const res = await fetch(`${base}/items/redirects?limit=-1&fields=url_from,url_to,response_code`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as {
      data: Array<{ url_from?: string; url_to?: string; response_code?: string }>;
    };

    const map: Record<string, { status: 301 | 302; destination: string }> = {};
    for (const r of data ?? []) {
      if (!r.url_from || !r.url_to) continue;
      const source = normalizeRedirectPath(r.url_from);
      const isExternal = /^https?:\/\//i.test(r.url_to);
      const destination = isExternal ? r.url_to : r.url_to.startsWith('/') ? r.url_to : `/${r.url_to}`;
      // Skip self-referential rows (malformed CMS data would otherwise loop).
      if (!isExternal && normalizeRedirectPath(destination) === source) continue;
      map[source] = { status: r.response_code === '302' ? 302 : 301, destination };
    }
    console.log(`[redirects] loaded ${Object.keys(map).length} redirects from CMS`);

    return map;
  } catch (error) {
    console.error('[redirects] failed to load from CMS, building without them:', error);

    return {};
  }
}

const cmsRedirects = await loadCmsRedirects();

// Debug logging
console.log('Environment variables at config load:');
console.log('ASTRO_OUTPUT:', process.env.ASTRO_OUTPUT);
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('ASTRO')));
console.log('Selected outputMode:', outputMode);

export default defineConfig({
  output: outputMode as 'server' | 'static',
  site: siteUrl,
  redirects: cmsRedirects,
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: directusHost,
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
    ],
  },
  vite: {
    envPrefix: ['PUBLIC_', 'DIRECTUS_', 'ASTRO_'],
    assetsInclude: ['**/*.svg'],
  },
});