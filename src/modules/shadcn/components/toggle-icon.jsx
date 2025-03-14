'use client';

import { cn } from '@/modules/common/helpers/utils';
import { Toggle } from '@/modules/shadcn/components/toggle';
import { Square, SquareDashed } from 'lucide-react';

export const ToggleIcon = ({ className, icons, ...props }) => {
    const onIcon = icons?.on || <Square />;
    const offIcon = icons?.off || <SquareDashed />;

    return (
        <Toggle
            className={cn(
                'group bg-transparent dark:bg-neutral-800 dark:hover:bg-neutral-700',
                className,
            )}
            {...props}
        >
            <div className='shrink-0 scale-0 opacity-0 transition-all group-aria-pressed:scale-100 group-aria-pressed:opacity-100'>
                {onIcon}
            </div>
            <div className='absolute shrink-0 scale-100 opacity-100 transition-all group-aria-pressed:scale-0 group-aria-pressed:opacity-0'>
                {offIcon}
            </div>
        </Toggle>
    );
};
