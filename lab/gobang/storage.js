/**
 * Created by johnnycage on 16/4/15.
 */
var storage = (function () {
    var itemCache = new Map();
    var objectCache = new Map();
    return {
        getItem: function (name) {
            if (itemCache.get(name)) {
                return itemCache.get(name);
            }
            if (localStorage) {
                var item = localStorage.getItem(name);
                if (item !== null && item !== undefined) {
                    itemCache.set(name, item);
                }
                return item;
            }
            return null;
        },
        getObject: function (name) {
            if (objectCache.get(name)) {
                return objectCache.get(name);
            }
            if (localStorage) {
                var itemStr = localStorage.getItem(name);
                var result = void 0;
                try {
                    result = JSON.parse(itemStr);
                    if (result !== null && typeof (result) === 'object') {
                        objectCache.set(name, result);
                        return result;
                    }
                    return null;
                }
                catch (Error) {
                    return null;
                }
            }
            return null;
        },
        setItem: function (name, value) {
            if (typeof (value) === 'object') {
                value = JSON.stringify(value);
            }
            itemCache.delete(name);
            objectCache.delete(name);
            localStorage.setItem(name, value);
        },
        remove: function (name) {
            itemCache.delete(name);
            objectCache.delete(name);
            localStorage.removeItem(name);
        },
        clear: function () {
            itemCache.clear();
            objectCache.clear();
            localStorage.clear();
        }
    };
}());