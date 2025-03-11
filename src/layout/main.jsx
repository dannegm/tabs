import { cn } from '@/helpers/utils';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Bookmarks } from './bookmarks';
import { Tabs } from './tabs';

export const Main = () => {
    const [theme] = useDarkMode();
    return (
        <main
            className={cn(
                theme,
                'grid grid-cols-[1fr_260px] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-screen overflow-hidden',
            )}
        >
            <Bookmarks className='[grid-area:main]' />
            <Tabs className='[grid-area:side]' />
        </main>
    );
};
