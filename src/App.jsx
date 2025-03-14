import { lazy, Suspense } from 'react';
import { cn } from '@/modules/common/helpers/utils';

import { useDarkMode } from '@/modules/common/hooks/use-dark-mode';
import { Providers } from '@/modules/common/providers/providers';
import { Loader } from '@/modules/common/components/loader';

const Tabs = lazy(() => import('@/modules/tabs/tabs'));
const Main = lazy(() => import('@/modules/main/main'));

export const App = () => {
    const [theme] = useDarkMode();

    return (
        <Providers>
            <Suspense fallback={<Loader />}>
                <main
                    className={cn(
                        theme,
                        'grid grid-cols-[1fr_260px] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-screen overflow-hidden',
                    )}
                >
                    <Main className='[grid-area:main]' />
                    <Tabs className='[grid-area:side]' />
                </main>
            </Suspense>
        </Providers>
    );
};
