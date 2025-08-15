import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Plus, Wrench, Trash2, RefreshCw } from 'lucide-react';

import { useSettings } from '@/modules/common/hooks/use-settings';

import { ScrollArea } from '@/modules/shadcn/components/scroll-area';
import { Badge } from '@/modules/shadcn/components/badge';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/modules/shadcn/components/dialog';

const APP_VERSION = __APP_VERSION__;
const changelogs = __CHANGELOGS__;

const getTypeIcon = type => {
    const typeIcons = {
        ADDED: <Plus className='h-4 w-4' />,
        FIXED: <Wrench className='h-4 w-4' />,
        REMOVED: <Trash2 className='h-4 w-4' />,
        CHANGED: <RefreshCw className='h-4 w-4' />,
    };
    return typeIcons[type] || null;
};

const getTypeBadgeVariant = type => {
    const typeBadgeVariants = {
        ADDED: 'success',
        FIXED: 'warning',
        REMOVED: 'error',
        CHANGED: 'info',
    };
    return typeBadgeVariants[type] || 'default';
};

const getSortedChangelogs = () => {
    return Object.keys(changelogs).sort((a, b) => {
        const parseVersion = version => version.split('.').map(Number);
        const versionA = parseVersion(a);
        const versionB = parseVersion(b);

        for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
            const numA = versionA[i] || 0;
            const numB = versionB[i] || 0;

            if (numA !== numB) {
                return numB - numA;
            }
        }
        return 0;
    });
};

export const Changelog = ({ children }) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [appVersion, setAppVersion] = useSettings('app:version', '0.0.0');

    useEffect(() => {
        if (!children && appVersion !== APP_VERSION) {
            setOpen(true);
            setAppVersion(APP_VERSION);
        }
    }, [children, appVersion, APP_VERSION]);

    const sortedVersions = getSortedChangelogs();

    const modalContent = (
        <DialogContent className='max-w-2xl p-0'>
            <DialogHeader className='p-4 pb-0'>
                <DialogTitle className='flex items-center justify-between'>
                    {t('changelogs.title')}
                </DialogTitle>
            </DialogHeader>

            <ScrollArea className='max-h-[60vh] p-4' type='always'>
                <div className='space-y-6'>
                    {sortedVersions.map(version => (
                        <div key={version} className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-sm font-semibold'>v{version}</h3>
                                {version === APP_VERSION && (
                                    <Badge variant='outline' className='text-xs'>
                                        {t('changelogs.labels.current')}
                                    </Badge>
                                )}
                            </div>

                            <div className='space-y-2'>
                                {changelogs[version]?.map((change, index) => (
                                    <div
                                        key={`${version}-${index}`}
                                        className='flex items-start justify-start gap-2 pb-2 mb-2 flex-1 border-b'
                                    >
                                        <Badge
                                            variant={getTypeBadgeVariant(change.type)}
                                            className='flex items-center gap-1 text-xs font-medium'
                                        >
                                            {getTypeIcon(change.type)}
                                            {change.type}
                                        </Badge>
                                        <p className='text-sm text-gray-600 dark:text-gray-300 flex-1 text-pretty'>
                                            {change.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {sortedVersions.length === 0 && (
                        <div className='text-center py-8 text-gray-500'>
                            <p>{t('changelogs.labels.no-entries')}</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </DialogContent>
    );

    if (children) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                {modalContent}
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {modalContent}
        </Dialog>
    );
};
