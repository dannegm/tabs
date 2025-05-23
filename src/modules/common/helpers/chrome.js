const IS_DEV = process.env.NODE_ENV === 'development';

const sampleTabs = [
    {
        id: 1,
        title: 'Google',
        url: 'https://www.google.com/',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=256',
        incognito: true,
    },
    {
        id: 2,
        title: 'Inicio / X',
        url: 'https://x.com/home',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=x.com&sz=256',
    },
    {
        id: 3,
        title: 'Youtube',
        url: 'https://www.youtube.com/',
        favIconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=256',
        audible: true,
    },
];

export const closeWindow = id => {
    chrome?.windows?.remove?.(+id);
};

export const createTab = ({ url }) => {
    chrome?.tabs?.create?.({ url });
};

export const closeTab = id => {
    chrome?.tabs?.remove?.(+id);
};

export const closeTabsByWindow = windowId => {
    chrome?.tabs?.query?.({ windowId }, tabs => {
        const currentTabId = tabs.find(tab => tab.active).id;
        tabs.forEach(tab => {
            if (tab.id !== currentTabId) {
                chrome?.tabs?.remove?.(tab.id);
            }
        });
    });
};

export const closeTabsCurrentWindow = () => {
    chrome.windows.getCurrent(window => {
        closeTabsByWindow(window.id);
    });
};

export const getAllTabs = (callback, query = {}) => {
    if (IS_DEV) {
        callback(sampleTabs);
        return;
    }

    chrome?.tabs?.query(query, tabs => {
        const filteredTabs = tabs.filter(tab => !tab?.url?.includes('://newtab'));
        callback(filteredTabs);
    });
};

export const getCurrentWindowTabs = callback => {
    getAllTabs(callback, { currentWindow: true });
};

const tabsEvents = [
    'onCreated',
    'onUpdated',
    'onRemoved',
    'onAttached',
    'onDetached',
    'onMoved',
    'onActivated',
    'onHighlighted',
    'onReplaced',
    'onZoomChange',
];

export const bindTabsEvents = (handler, events = tabsEvents) => {
    events.forEach(event => {
        chrome?.tabs?.[event].addListener(handler);
    });
};

export const unbindTabsEvents = (handler, events = tabsEvents) => {
    events.forEach(event => {
        chrome?.tabs?.[event].addListener(handler);
    });
};
