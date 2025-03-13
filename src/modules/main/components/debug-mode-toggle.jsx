'use client';

import { Bug, BugOff } from 'lucide-react';
import { useSettings } from '@/modules/common/hooks/use-settings';
import { Toggle } from '@/modules/shadcn/components/toggle';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';

export const DebugModeToggle = () => {
    const [debug, setDebug] = useSettings('settings:debug', false);

    return (
        <Tooltip content='Toggle Debug Mode'>
            <Toggle
                variant='ghost'
                className='group bg-transparent dark:bg-neutral-800 dark:hover:bg-neutral-700'
                pressed={debug}
                onPressedChange={setDebug}
            >
                <Bug className='shrink-0 scale-0 opacity-0 transition-all group-aria-pressed:scale-100 group-aria-pressed:opacity-100' />
                <BugOff className='absolute shrink-0 scale-100 opacity-100 transition-all group-aria-pressed:scale-0 group-aria-pressed:opacity-0' />
            </Toggle>
        </Tooltip>
    );
};
