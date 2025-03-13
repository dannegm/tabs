import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';

const { version, description, author } = packageJson;
const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

export default defineManifest({
    manifest_version: 3,
    name: 'Tabs.',
    description,
    author,
    version: `${major}.${minor}.${patch}.${label}`,
    version_name: version,
    permissions: ['tabs', 'windows'],

    icons: {
        16: 'icons/icon-16.png',
        128: 'icons/icon-128.png',
    },

    chrome_url_overrides: {
        newtab: 'index.html',
    },
});
