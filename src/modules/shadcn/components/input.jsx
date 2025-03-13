import * as React from 'react';
import { AtSign, CircleX } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';

function Input({ className, type, startIcon, onClear, ...props }) {
    return (
        <div className='relative'>
            {startIcon && (
                <div className='[&_svg]:size-4 [&_svg]:stroke-2 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
                    {startIcon}
                </div>
            )}
            <input
                type={type}
                data-slot='input'
                className={cn(
                    'peer border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    { 'ps-9': startIcon },
                    className,
                )}
                {...props}
            />
            {onClear !== undefined && (
                <button
                    className='[&_svg]:size-4 [&_svg]:stroke-2 absolute inset-y-0 end-0 h-full w-9 flex items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                    aria-label='Clear input'
                    onClick={onClear}
                >
                    <CircleX />
                </button>
            )}
        </div>
    );
}

export { Input };
