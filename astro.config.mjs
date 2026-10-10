import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  redirects: {
    '/products/domain-registration/': '/services/domain-registration-management/',
    '/products/web-hosting/': '/services/managed-web-hosting/'
  },
  site: 'https://softdows.com',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
        platformProxy: {
      enabled: true
    }
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const placeholders = [
          '/contact/', '/start-a-project/', 
          '/privacy/', '/terms/', '/smart-re-loader-privacy/',
          '/work/', '/design-system/'
        ];
        return !placeholders.includes(url.pathname);
      },
      customPages: [
        'https://softdows.com/clients/sherascrap',
        'https://softdows.com/clients/aziara-high-school'
      ]
    })
  ]
});
