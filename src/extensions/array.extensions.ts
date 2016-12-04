interface Array<T> {
    filterMap(predFunc: (T) => boolean | any, mapFunc: (T) => T): Array<T>
}

Array.prototype.filterMap = (predFunc, mapFunc) => {
    return Array.prototype.map.call(this, value => {
        let match = false;
        if (typeof predFunc === 'function') {
            match = predFunc(value);
        } else {
            match = value === predFunc;
        }
        return match ? mapFunc(value) : value;
    });
};