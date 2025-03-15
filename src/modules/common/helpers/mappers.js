export const sanitizeItem = item => ({
    id: item.id,
    title: item.title,
    url: item.url,
    favIconUrl: item.favIconUrl,
    customTitle: '',
    customDescription: '',
});

export const newItem = (item, index = 0) => ({
    id: item.id,
    created_at: Date.now(),
    index: index,
    title: item.title,
    url: item.url,
    favIconUrl: item.favIconUrl,
    customTitle: '',
    customDescription: '',
});
