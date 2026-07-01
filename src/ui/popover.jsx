import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react';

import { cn } from '@/helpers/utils';

function Popover({ ...props }) {
    return <PopoverPrimitive.Root data-slot='popover' {...props} />;
}

function PopoverTrigger({ asChild, children, ...props }) {
    if (asChild && React.isValidElement(children)) {
        return (
            <PopoverPrimitive.Trigger
                data-slot='popover-trigger'
                nativeButton={false}
                render={(renderProps) => {
                    const { nativeButton: _, ...safeProps } = renderProps;
                    return React.cloneElement(children, safeProps);
                }}
                {...props}
            />
        );
    }
    return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props}>{children}</PopoverPrimitive.Trigger>;
}

function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner align={align} sideOffset={sideOffset}>
                <PopoverPrimitive.Popup
                    data-slot='popover-content'
                    className={cn(
                        'bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden',
                        'transition-all data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
                        className,
                    )}
                    {...props}
                />
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    );
}

function PopoverAnchor({ children, ...props }) {
    return <span data-slot='popover-anchor' {...props}>{children}</span>;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
