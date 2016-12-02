;(function (win, lib) {
    /* @note    localStorage组件，适用场景为移动端。
                get：获取某storage
                set：设置某条, 不传第二个参数，就默认删除此条
                remove：删除某条
                getAll：查找所有可用的storage键值对。
                clear：清空所有的storage。
     * @author  Xaber
     */

    var storage = {},
        localStorageName = 'localStorage',
        lstr;

    var isLocalStorageNameSupported = function () {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    };

    storage.version = '1.0.0';
    storage.set = function(key, value) {};
    storage.get = function(key) {};
    storage.has = function(key) {
        return store.get(key) !== undefined;
    };
    storage.remove = function(key) {};
    storage.clear = function() {};
    storage.getAll = function() {};
    storage.serialize = function(value) {
        return JSON.stringify(value)
    }
    storage.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    }

    if (lib.storage) {
        return;
    }

    if (isLocalStorageNameSupported()) {
        lstr = win.localStorage;
        storage.set = function(key, val) {
            if (typeof val === 'undefined') { 
                return storage.remove(key) ;
            }
            lstr.setItem(key, storage.serialize(val));
            return val;
        };
        storage.get = function(key) {
            //取出数据时，打点纪录，统计能节省多少的流量
            return storage.deserialize(lstr.getItem(key));
        };
        storage.remove = function(key) { 
            lstr.removeItem(key); 
        };
        storage.clear = function() { 
            lstr.clear();
        };
        storage.getAll = function() {

            //如果没有传入index参数则返回所有key
            var ret = {},
                key;
            for (var i = 0; i < lstr.length; i++) {
                key = lstr.key(i);
                ret[key] = storage.get(key);
            }
            return ret;
        };
    }

    lib.storage = storage;

})(window, window.lib || (window.lib = {}));