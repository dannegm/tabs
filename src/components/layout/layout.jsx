import { Suspense } from 'react';

import { cn } from '@/helpers/utils';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Loader } from '@/components/system/loader';

export const Layout = ({ children }) => {
    const [theme] = useDarkMode();

    return (
        <div className={cn(theme, 'w-full h-screen overflow-hidden')}>
            <Suspense fallback={<Loader />}>
                {children}
            </Suspense>
        </div>
    );
};
