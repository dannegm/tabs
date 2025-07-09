import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/modules/common/helpers/i18next';
import './index.css';

import { App } from './app.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
