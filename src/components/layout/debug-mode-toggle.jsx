import { useTranslation } from 'react-i18next';

import { Bug, BugOff } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { Tooltip } from '@/ui/tooltip-simple';
import { ToggleIcon } from '@/ui/toggle-icon';

export const DebugModeToggle = () => {
    const { t } = useTranslation();
    const [debug, setDebug] = useSettings('debug', false);

    return (
        <Tooltip content={t('common.debug-mode-toggle.tooltip')}>
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
