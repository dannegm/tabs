import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { crx } from '@crxjs/vite-plugin';

import manifest from './manifest.config.js';

export default defineConfig({
    plugins: [react(), crx({ manifest }), tailwindcss()],
    resolve: {
        alias: {
            '@': './src',
        },
    },
});
