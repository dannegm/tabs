import { useCollections } from '@/store/collections';
import { downloadBlob } from '@/modules/common/helpers/utils';
import { reverse } from '@/modules/common/helpers/arrays';

export const ExportCollection = ({ onSuccess, children }) => {
    const collections = useCollections();

    const prepareData = data => {
        const content = {
            version: 3,
            lists: reverse(Object.values(data)).map(collection => ({
                title: collection.name,
                cards: Object.values(collection.items).map(item => ({
                    title: item.title,
                    url: item.url,
                    customTitle: item?.customTitle || '',
                    customDescription: item?.customDescription || '',
                    favIconUrl: item.favIconUrl,
                    bgColor: item?.bgColor,
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
        onSuccess?.();
    };

    return <div onClick={handleDownload}>{children}</div>;
};
