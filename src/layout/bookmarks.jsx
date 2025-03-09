import { cn } from '@/helpers/utils';

export const Bookmarks = ({ className }) => {
    return (
        <section
            className={cn(
                'w-full h-full flex flex-col gap-8 border-l-8 border-l-rose-300',
                className,
            )}
        >
            <div className='flex flex-row items-center justify-between h-12 p-4 border-b border-b-neutral-200'>
                <div className='flex-1'>
                    <h1 className='text-sm font-bold uppercase text-rose-600'>Tabs.</h1>
                </div>
            </div>
        </section>
    );
};
