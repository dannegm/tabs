import { Tooltip as TooltipPrimitive } from '@base-ui/react';

import { cn } from '@/helpers/utils';

function TooltipProvider({ delayDuration = 700, children, ...props }) {
    return (
        <TooltipPrimitive.Provider delay={delayDuration} {...props}>
            {children}
        </TooltipPrimitive.Provider>
    );
}

function Tooltip({ ...props }) {
    return <TooltipPrimitive.Root data-slot='tooltip' {...props} />;
}

function TooltipTrigger({ ...props }) {
    return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />;
}

function TooltipContent({ className, sideOffset = 0, side = 'top', children, ...props }) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
                <TooltipPrimitive.Popup
                    data-slot='tooltip-content'
                    className={cn(
                        'bg-primary text-primary-foreground z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
                        'transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
                        className,
                    )}
                    {...props}
                >
                    {children}
                    <TooltipPrimitive.Arrow className='bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]' />
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
