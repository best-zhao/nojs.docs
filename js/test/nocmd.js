define("test/nocmd", [ "../a", "test/lottery" ], function(require) {
    require("../a");
});

define("a", [ "test/lottery" ], function(require) {
    //var b = require('./b');
    require("test/lottery");
    return "a";
});
