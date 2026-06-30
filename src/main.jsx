import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/helpers/i18next';
import './index.css';

import { runMigration } from '@/services/migration';
import { App } from './app.jsx';

runMigration();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
