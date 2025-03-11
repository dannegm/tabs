import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/helpers/utils';

function ScrollArea({ className, classNames, children, ...props }) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot='scroll-area'
            className={cn('relative', className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot='scroll-area-viewport'
                className='ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1'
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar className={classNames?.bar} classNames={classNames} />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({ className, classNames, orientation = 'vertical', ...props }) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot='scroll-area-scrollbar'
            orientation={orientation}
            className={cn(
                'flex touch-none p-px transition-colors select-none',
                orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
                orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot='scroll-area-thumb'
                className={cn('bg-border relative flex-1 rounded-full', classNames?.thumb)}
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}

export { ScrollArea, ScrollBar };
