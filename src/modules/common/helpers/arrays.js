export const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export const sequence = size => Array.from(Array(size), (_, index) => index);

export const unique = arr => [...new Set(arr)];

export const groupBy = (elements = [], sentence) => {
    return elements.reduce((groups, element) => {
        const group = typeof sentence === 'function' ? sentence(element) : element[sentence];

        groups[group] ??= [];
        groups[group].push(element);

        return groups;
    }, {});
};

export const reverse = (arr = []) => [...arr].reverse();

export const sortBy = (arr, key, direction = 'asc') =>
    arr.sort((a, b) => (direction === 'asc' ? a[key] - b[key] : b[key] - a[key]));

export const move = (array, oldIndex, newIndex) => {
    if (oldIndex === newIndex) return array;

    const updated = [...array];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    return updated;
};
