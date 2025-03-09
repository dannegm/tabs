import { cn } from '@/helpers/utils';

export const TabItem = ({ className }) => {
    const domain = 'youtube.com';
    return (
        <div
            className={cn(
                'flex flex-row gap-2 px-3 py-2 items-center text-sm border border-neutral-200 rounded-sm',
                className,
            )}
        >
            <img
                className='size-4'
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
            />
            <span className='line-clamp-1'>
                Titulo de la pagona que es muy muy largo para mostrarse aquí
            </span>
        </div>
    );
};
