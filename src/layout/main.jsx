import { Bookmarks } from './bookmarks';
import { Tabs } from './tabs';

export const Main = () => {
    return (
        <main className='grid grid-cols-[1fr_260px] grid-rows-[1fr] [grid-template-areas:"main_side"] w-full h-screen'>
            <Bookmarks className='[grid-area:main]' />
            <Tabs className='[grid-area:side]' />
        </main>
    );
};
