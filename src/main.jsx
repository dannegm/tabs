import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import '@/helpers/i18next';
import './index.css';

import { runMigration } from '@/services/migration';
import { Providers } from '@/providers/providers';
import { router } from '@/router.jsx';

runMigration();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    </StrictMode>,
);
