import { useTranslation } from 'react-i18next';

import { BadgeInfo, FolderInput, FolderOutput, PackagePlus, Trash2 } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { useCollectionsActions } from '@/services/collections';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

import { ConfirmDialog } from '@/components/system/confirm-dialog';

import { ImportCollection } from '@/components/collections/import-collection';
import { ExportCollection } from '@/components/collections/export-collection';
import { AboutDialog } from '@/components/layout/about-dialog';
import { Changelog } from '@/components/layout//changelogs';

export const SettingsMenu = ({ children, side = 'bottom', align = 'end' }) => {
    const { t } = useTranslation();
    const { clearCollections } = useCollectionsActions();

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

                <ConfirmDialog
                    title={t('settings.dialogs.clear-collections.title')}
                    description={t('settings.dialogs.clear-collections.description')}
                    onAccept={clearCollections}
                >
                    <DropdownMenuItem>
                        <Trash2 />
                        {t('settings.collections.items.clear')}
                    </DropdownMenuItem>
                </ConfirmDialog>

                <DropdownMenuSeparator />

                <Changelog>
                    <DropdownMenuItem>
                        <PackagePlus />
                        {t('settings.main.items.changelogs')}
                    </DropdownMenuItem>
                </Changelog>

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
