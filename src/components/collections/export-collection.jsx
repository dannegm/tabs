import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCollections } from '@/services/collections';
import { downloadBlob } from '@/helpers/utils';
import { reverse } from '@/helpers/arrays';

export const ExportCollection = ({ onSuccess, children }) => {
    const { t } = useTranslation();
    const collections = useCollections();

    const prepareData = data => {
        const content = {
            version: 3,
            lists: reverse(Object.values(data)).map(collection => ({
                title: collection.name,
                bgColor: collection?.bgColor,
                cards: Object.values(collection.items).map(item => ({
                    title: item.title,
                    url: item.url,
                    customTitle: item?.customTitle || '',
                    customDescription: item?.customDescription || '',
                    favIconUrl: item.favIconUrl,
                })),
            })),
        };
        return JSON.stringify(content, null, 4);
    };

    const handleDownload = () => {
        const data = prepareData(collections);
        const blob = new Blob([data], { type: 'application/json' });
        const filename = `tabs-export-${Date.now()}.json`;
        downloadBlob(blob, filename);

        toast.success(
            t('common.export.alerts.all-collections-exported', {
                count: Object.keys(collections).length,
            }),
        );
        onSuccess?.();
    };

    return <div onClick={handleDownload}>{children}</div>;
};
