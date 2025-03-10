import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';

const { version } = packageJson;
const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

export default defineManifest(async env => ({
    manifest_version: 3,
    name: env.mode === 'staging' ? '[INTERNAL] Tabs.' : 'Tabs.',
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: version,
    permissions: ['tabs', 'windows'],

    chrome_url_overrides: {
        newtab: 'index.html',
    },
}));
