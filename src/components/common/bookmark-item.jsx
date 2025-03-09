import { cn } from '@/helpers/utils';

export const BookmarkItem = ({ className }) => {
    const domain = 'youtube.com';
    return (
        <div className={cn('flex flex-col w-52 border border-neutral-200 rounded-sm', className)}>
            <div className='flex flex-row gap-2 items-center justify-start h-16 px-4'>
                <img
                    className='size-6'
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
                />
                <span className='text-sm line-clamp-1'>
                    Titulo de la pagona que es muy muy largo para mostrarse aquí
                </span>
            </div>
            <div className='px-2 py-1.5 bg-neutral-100 text-xs line-clamp-1'>
                https://ui.shadcn.com/docs/components/input
            </div>
        </div>
    );
};
