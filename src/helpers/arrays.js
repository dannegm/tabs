export const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export const randomIndex = (arr = []) => Math.floor(Math.random() * arr.length);
export const randomPick = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

export const randomPickWithMemory = (arr = []) => {
    if (!arr.length) return null;

    let available = [...arr];
    let lastPicked = null;

    return () => {
        if (!available.length) {
            available = [...arr].filter(item => item !== lastPicked);
        }

        const index = Math.floor(Math.random() * available.length);
        lastPicked = available.splice(index, 1)[0];

        return lastPicked;
    };
};

export const probabilityPick = items => {
    const probability = Math.random();
    let cumulative = 0;
    const shuffledItems = shuffle(items);
    for (const [item, prob] of shuffledItems) {
        cumulative += prob;
        if (probability <= cumulative) return item;
    }
    return randomPick(items);
};

export const pickFromIndex = (arr = [], index = 0) => {
    if (Number.isNaN(index)) {
        return randomPick(arr);
    }

    if (arr[index] === undefined) {
        return randomPick(arr);
    }

    return arr[index];
};

export const sequence = size => Array.from(Array(size), (_, index) => index);

export const updateItemById = (arr = [], id, key, newValue) => {
    return arr.map(item => (item.id === id ? { ...item, [key]: newValue } : item));
};

export const removeItemById = (arr = [], id) => {
    return arr.filter(item => item.id !== id);
};

export const removeItemAtIndex = (arr, index) => {
    const element = arr.at(index);
    const deletedIndex = arr.indexOf(element);
    return [...arr.slice(0, deletedIndex), ...arr.slice(deletedIndex + 1)];
};

export const randomSlice = (arr = [], size = 1) => {
    return [...shuffle(arr)].slice(0, size);
};

export const unique = arr => [...new Set(arr)];

export const groupBy = (elements = [], sentence) => {
    return elements.reduce((groups, element) => {
        const group = typeof sentence === 'function' ? sentence(element) : element[sentence];

        groups[group] ??= [];
        groups[group].push(element);

        return groups;
    }, {});
};
