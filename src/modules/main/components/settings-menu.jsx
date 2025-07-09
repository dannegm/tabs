import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BadgeInfo, FolderInput, FolderOutput, Trash2 } from 'lucide-react';

import { cn } from '@/modules/common/helpers/utils';
import { useCollectionsActions } from '@/store/collections';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/modules/shadcn/components/dropdown-menu';

import { ConfirmDialog } from '@/modules/common/components/confirm-dialog';

import { ImportCollection } from '@/modules/collections/components/import-collection';
import { ExportCollection } from '@/modules/collections/components/export-collection';
import { AboutDialog } from '@/modules/main/components/about-dialog';

export const SettingsMenu = ({ children, side = 'bottom', align = 'end' }) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const { clearCollections } = useCollectionsActions();

    const handleClose = () => {
        setOpen(false);
    };

    const handleClearCollection = () => {
        clearCollections();
        handleClose();
    };

    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger onClick={() => setOpen(true)} asChild>
                {children}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className='w-56'
                side={side}
                align={align}
                onCloseAutoFocus={handleClose}
                onEscapeKeyDown={handleClose}
                onPointerDownOutside={handleClose}
                onFocusOutside={handleClose}
                onInteractOutside={handleClose}
            >
                <DropdownMenuLabel>{t('settings.collections.title')}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ExportCollection onSuccess={handleClose}>
                    <DropdownMenuItem>
                        <FolderOutput />
                        {t('settings.collections.items.export')}
                    </DropdownMenuItem>
                </ExportCollection>

                <ImportCollection onError={handleClose} onSuccess={handleClose}>
                    <DropdownMenuItem>
                        <FolderInput />
                        {t('settings.collections.items.import')}
                    </DropdownMenuItem>
                </ImportCollection>

                <ConfirmDialog
                    title={t('settings.dialogs.clear-collections.title')}
                    description={t('settings.dialogs.clear-collections.description')}
                    onCancel={handleClose}
                    onAccept={handleClearCollection}
                >
                    <DropdownMenuItem>
                        <Trash2 />
                        {t('settings.collections.items.clear')}
                    </DropdownMenuItem>
                </ConfirmDialog>

                <DropdownMenuSeparator />

                <AboutDialog>
                    <DropdownMenuItem>
                        <BadgeInfo />
                        {t('settings.main.items.about')}
                        <span
                            className={cn(
                                'font-bold uppercase text-rose-600',
                                'dark:text-rose-400',
                            )}
                        >
                            {t('settings.main.items.tabs')}
                        </span>
                    </DropdownMenuItem>
                </AboutDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
