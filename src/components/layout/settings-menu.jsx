import { useTranslation } from 'react-i18next';

import { BadgeInfo, FolderInput, FolderOutput, PackagePlus, Trash2 } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { useCollectionsActions } from '@/services/collections';
import { useModal } from '@/hooks/use-modal';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

import { ImportCollection } from '@/components/collections/import-collection';
import { ExportCollection } from '@/components/collections/export-collection';

export const SettingsMenu = ({ children, side = 'bottom', align = 'end' }) => {
    const { t } = useTranslation();
    const { clearCollections } = useCollectionsActions();
    const { open: openConfirm } = useModal('confirm');
    const { open: openChangelog } = useModal('changelog');
    const { open: openAbout } = useModal('about');

    const handleClear = () => {
        openConfirm({
            title: t('settings.dialogs.clear-collections.title'),
            description: t('settings.dialogs.clear-collections.description'),
            onAccept: clearCollections,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

            <DropdownMenuContent className='w-56' side={side} align={align}>
                <DropdownMenuLabel>{t('settings.collections.title')}</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ExportCollection>
                    <DropdownMenuItem>
                        <FolderOutput />
                        {t('settings.collections.items.export')}
                    </DropdownMenuItem>
                </ExportCollection>

                <ImportCollection>
                    <DropdownMenuItem>
                        <FolderInput />
                        {t('settings.collections.items.import')}
                    </DropdownMenuItem>
                </ImportCollection>

                <DropdownMenuItem onClick={handleClear}>
                    <Trash2 />
                    {t('settings.collections.items.clear')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => openChangelog()}>
                    <PackagePlus />
                    {t('settings.main.items.changelogs')}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => openAbout()}>
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
