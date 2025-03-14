'use client';

import { Bug, BugOff } from 'lucide-react';
import { useSettings } from '@/modules/common/hooks/use-settings';
import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { ToggleIcon } from '@/modules/shadcn/components/toggle-icon';

export const DebugModeToggle = () => {
    const [debug, setDebug] = useSettings('settings:debug', false);

    return (
        <Tooltip content='Toggle Debug Mode'>
            <ToggleIcon
                variant='ghost'
                pressed={debug}
                onPressedChange={setDebug}
                icons={{
                    on: <Bug />,
                    off: <BugOff />,
                }}
            />
        </Tooltip>
    );
};
