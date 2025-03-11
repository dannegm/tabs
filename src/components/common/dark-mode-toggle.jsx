'use client';

import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Toggle } from '@/components/shadcn/toggle';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/shadcn/tooltip';

export const DarkModeToggle = () => {
    const [theme, toggle] = useDarkMode();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Toggle
                        variant='ghost'
                        className='group size-9 bg-transparent dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        pressed={theme === 'dark'}
                        onPressedChange={toggle}
                    >
                        <Moon
                            size={16}
                            strokeWidth={2}
                            className='shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100'
                        />
                        <Sun
                            size={16}
                            strokeWidth={2}
                            className='absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0'
                        />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                    <p>Toggle Dark Mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
