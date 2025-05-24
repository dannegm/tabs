export const fromArray = (arr = [], key = 'index') => {
    return arr.reduce((acc, cur, index) => {
        const customKey = key === 'index' ? index : cur[key];
        acc[customKey] = cur;
        return acc;
    }, {});
};

export const fromJSON = str => JSON.parse(str);

export const toJSON = obj => JSON.stringify(obj);
