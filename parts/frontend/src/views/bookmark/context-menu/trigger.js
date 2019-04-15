var events = [];
var on = function (cb) {
    events.push(cb);
};
var off = function (cb) {
    var index = events.findIndex(function (_cb) { return _cb === cb; });
    if (index > -1) {
        events.splice(index, 1);
    }
};
var emit = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    events.forEach(function (cb) {
        cb.apply(null, args);
    });
};
export { on, off, emit };
