interface Array<T> {
    filterMap(predFunc: (T, number?) => boolean | any, mapFunc: (T) => T): Array<T>

    copy(): Array<T>

    mapMergeAtIndex(index: number, mergeFrom: any): Array<T>

    mapAtIndex(index: number, mapFunc: (T) => T): Array<T>
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

Array.prototype.mapMergeAtIndex = function mergeAtIndex(index, mergeFrom) {
    let result = Array.prototype.copy.call(this);
    if (index >= result.length) {
        throw 'Index out of range';
    }
    result[index] = Object.assign({}, result[index], mergeFrom);
    return result;
};

Array.prototype.mapAtIndex = function mergeAtIndex(index, mapFunc) {
    let result = Array.prototype.copy.call(this);
    if (index >= result.length) {
        throw 'Index out of range';
    }
    result[index] = mapFunc(result[index]);
    return result;
};