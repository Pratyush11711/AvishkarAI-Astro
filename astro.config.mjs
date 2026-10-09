import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

export default defineConfig({
  // Server-only secrets for /api/contact. Never exposed to the browser.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      SHEET_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SHEET_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  // Pending: the source still uses its Netlify URL; replace once the production domain is confirmed.
  site: 'https://avishkarai.netlify.app',

  output: 'static',

  // /verdicta, not /verdicta.html or /verdicta/. Relative asset URLs stay correct without a trailing slash.
  trailingSlash: 'never',

  // The source markup relies on its exact whitespace between inline elements.
  compressHTML: false,

  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'html-route-redirect',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = (req.url || '').split('?')[0];
            if (!path.endsWith('.html') || path === '/404.html') return next();
            const clean = path === '/index.html' ? '/' : path.slice(0, -'.html'.length);
            res.writeHead(301, { Location: clean });
            res.end();
          });
        },
      },
    ],
    build: {
      // The CSS minifier rewrites custom property values, e.g. rgba(12,12,13,.08) becomes #0c0c0d14,
      // which is a different alpha. The source stylesheets ship as authored.
      cssMinify: false,
      // three.js r128 is a single lazily imported chunk of ~600 KB.
      chunkSizeWarningLimit: 700,
    },
  },

  adapter: vercel(),
});