import { cn } from '@/helpers/utils';

import { Button } from '@/components/shadcn/button';
import { X } from 'lucide-react';

export const TabItem = ({ className, item }) => {
    const handleClose = () => {
        chrome?.tabs?.remove?.(item?.id);
    };

    return (
        <div
            className={cn(
                'group flex flex-row gap-2 px-3 py-2 pr-1 items-center text-sm border border-neutral-200 rounded-sm',
                className,
            )}
        >
            <img className='size-4' src={item.favIconUrl} />
            <span className='flex-1 line-clamp-1'>{item.title}</span>
            <Button
                className='invisible group-hover:visible'
                size='icon-xs'
                variant='ghost'
                onClick={handleClose}
            >
                <X />
            </Button>
        </div>
    );
};
