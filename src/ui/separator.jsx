import { Separator as SeparatorPrimitive } from '@base-ui/react';

import { cn } from '@/helpers/utils';

function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
    return (
        <SeparatorPrimitive
            data-slot='separator-root'
            orientation={orientation}
            aria-hidden={decorative || undefined}
            className={cn(
                'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
