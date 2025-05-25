import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { crx } from '@crxjs/vite-plugin';

import manifest from './src/manifest.js';

import pkg from './package.json'

export default defineConfig({
    plugins: [react(), tailwindcss(), crx({ manifest })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
});
