define("url", [ "./a", "test/lottery" ], function(require, $, ui) {
    require("./a");
    function setUrl(key, value) {
        //@value: null清空参数undefined获取参数值 否则设置参数值
        var hash = location.hash.replace(/^#/, "").split("&"), i, m, _hash = {};
        key = key || "id";
        for (i = 0; i < hash.length; i++) {
            if (!hash[i]) {
                continue;
            }
            m = hash[i].split("=");
            _hash[m[0]] = m[1];
        }
        if (value == _hash[key]) {
            return _hash[key];
        }
        if (value === null) {
            delete _hash[key];
        } else if (value === undefined) {
            return _hash[key];
        } else {
            _hash[key] = value;
            setUrl.key = key;
        }
        hash = [];
        for (i in _hash) {
            hash.push(i + "=" + _hash[i]);
        }
        setUrl.call && setUrl.call();
        location.hash = hash.join("&");
    }
    setUrl.key = "id";
    return setUrl;
});

define("a", [ "test/lottery" ], function(require) {
    //var b = require('./b');
    require("test/lottery");
    return "a";
});
