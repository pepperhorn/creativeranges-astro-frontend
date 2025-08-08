// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || '';
const directusHost = directusUrl?.split('//')[1];

const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

// Get output mode from environment variable, default to 'server' for development
const outputMode = process.env.ASTRO_OUTPUT || 'server';

// Debug logging
console.log('Environment variables at config load:');
console.log('ASTRO_OUTPUT:', process.env.ASTRO_OUTPUT);
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('ASTRO')));
console.log('Selected outputMode:', outputMode);

export default defineConfig({
  output: outputMode as 'server' | 'static',
  site: siteUrl,
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