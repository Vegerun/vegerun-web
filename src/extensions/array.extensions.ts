interface Array<T> {
    filterMap(predFunc: (T, number?) => boolean | any, mapFunc: (T) => T): Array<T>

    copy(): Array<T>
}

Array.prototype.filterMap = function filterMap(predFunc, mapFunc) {
    return Array.prototype.map.call(this, (value, index) => {
        let match = false;
        if (typeof predFunc === 'function') {
            match = predFunc(value, index);
        } else {
            match = value === predFunc;
        }
        return match ? mapFunc(value) : value;
    });
};

Array.prototype.copy = function copy() {
    return [...this];
};