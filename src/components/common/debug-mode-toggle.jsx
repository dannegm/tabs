'use client';

import { Bug, BugOff } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { Toggle } from '@/components/shadcn/toggle';

export const DebugModeToggle = () => {
    const [debug, setDebug] = useSettings('settings:debug', false);

    return (
        <div>
            <Toggle
                variant='ghost'
                className='group size-9 bg-transparent dark:bg-neutral-800 dark:hover:bg-neutral-700'
                pressed={debug}
                onPressedChange={setDebug}
            >
                <Bug
                    size={16}
                    strokeWidth={2}
                    className='shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100'
                />
                <BugOff
                    size={16}
                    strokeWidth={2}
                    className='absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0'
                />
            </Toggle>
        </div>
    );
};
