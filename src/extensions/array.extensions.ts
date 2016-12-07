interface Array<T> {
    filterMap<T>(predFunc: (T, number?) => boolean | any, mapFunc: (T) => T): Array<T>
    
    mapMergeAtIndex<T>(index: number, mergeFrom: any): Array<T>

    mapAtIndex<T>(index: number, mapFunc: (T) => T): Array<T>
}

Array.prototype.filterMap = function filterMap<T>(predFunc, mapFunc) {
    return (<Array<T>>this).map((value, index) => {
        let match = false;
        if (typeof predFunc === 'function') {
            match = predFunc(value, index);
        } else {
            match = value === predFunc;
        }
        return match ? mapFunc(value) : value;
    });
};

Array.prototype.mapMergeAtIndex = function mergeAtIndex(index, mergeFrom) {
    let result = [...this];
    if (index >= result.length) {
        throw 'Index out of range';
    }
    result[index] = Object.assign({}, result[index], mergeFrom);
    return result;
};

Array.prototype.mapAtIndex = function mergeAtIndex(index, mapFunc) {
    let result = [...this];
    if (index >= result.length) {
        throw 'Index out of range';
    }
    result[index] = mapFunc(result[index]);
    return result;
};