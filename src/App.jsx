import { lazy, Suspense } from 'react';

import { cn } from '@/helpers/utils';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Providers } from '@/providers/providers';
import { Loader } from '@/components/system/loader';

const Tabs = lazy(() => import('@/components/tabs/tabs'));
const Main = lazy(() => import('@/components/layout/main'));

export const App = () => {
    const [theme] = useDarkMode();

    return (
        <Providers>
            <Suspense fallback={<Loader />}>
                <main
                    className={cn(
                        theme,
                        'grid grid-cols-[1fr_var(--sidebar-width)] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-screen overflow-hidden',
                    )}
                >
                    <Main className='[grid-area:main]' />
                    <Tabs className='[grid-area:side]' />
                </main>
            </Suspense>
        </Providers>
    );
};
