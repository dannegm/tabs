import { cn } from '@/modules/common/helpers/utils';
import { Collections } from '@/modules/collections/collections';

import { Header } from './components/header';
import { Debugger } from './components/debugger';

export const Main = ({ className }) => {
    return (
        <section
            className={cn(
                'w-full h-full max-h-screen flex flex-col border-l-8 border-l-rose-300',
                'dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-rose-500',
                className,
            )}
        >
            <Header />
            <Debugger />
            <Collections />
        </section>
    );
};

export default Main;
