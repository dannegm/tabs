import { useTranslation } from 'react-i18next';

import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/modules/common/hooks/use-dark-mode';

import { Tooltip } from '@/modules/shadcn/components/tooltip-simple';
import { ToggleIcon } from '@/modules/shadcn/components/toggle-icon';

export const DarkModeToggle = () => {
    const { t } = useTranslation();
    const [theme, toggle] = useDarkMode();

    return (
        <Tooltip content={t('common.dark-mode-toggle.tooltip')}>
            <ToggleIcon
                variant='ghost'
                pressed={theme === 'dark'}
                onPressedChange={toggle}
                icons={{
                    off: <Sun />,
                    on: <Moon />,
                }}
            />
        </Tooltip>
    );
};
