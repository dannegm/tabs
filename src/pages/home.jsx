import { lazy } from 'react';

import { Layout } from '@/components/layout/layout';

const Main = lazy(() => import('@/components/layout/main'));
const Tabs = lazy(() => import('@/components/tabs/tabs'));

export const HomePage = () => (
    <Layout>
        <main className='grid grid-cols-[1fr_var(--sidebar-width)] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-full'>
            <Main className='[grid-area:main]' />
            <Tabs className='[grid-area:side]' />
        </main>
    </Layout>
);
