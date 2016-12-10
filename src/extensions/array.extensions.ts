interface Array<T> {
    filterMap<T>(this: Array<T>, predFn: (T, number?) => boolean | any, mapFn: (T) => T): Array<T>;

    selectMany<T, U>(this: Array<T>, mapFn: (T) => Array<U>): Array<U>;

    keyBy<TKey, TValue>(this: Array<TValue>, selectFn: (TValue) => TKey): Map<TKey, TValue>;
}

Array.prototype.filterMap = function filterMap<T>(this: Array<T>, predFn, mapFn) {
    return this.map((value, index) => {
        let match = false;
        if (typeof predFn === 'function') {
            match = predFn(value, index);
        } else {
            match = value === predFn;
        }
        return match ? mapFn(value) : value;
    });
};

Array.prototype.selectMany = function selectMany<T, U>(this: Array<T>, mapFn: (T) => Array<U>): Array<U> {
    return [].concat(...this.map(mapFn));
}

Array.prototype.keyBy = function keyBy<TKey, TValue>(this: Array<TValue>, selectFn: (TValue) => TKey): Map<TKey, TValue> {
    return this.reduce(
        (map, item) => {
            let key = selectFn(item);
            map.set(key, item);
            return map;  
        },
        new Map<TKey, TValue>());
}