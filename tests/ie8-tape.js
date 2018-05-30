/**
 * Very very VERY barebones tap test harness that works in IE8 (no Buffer, no streams).
 * It doesn't include any assertions because events tests use the `assert` module anyway.
 */
var queue = [];
var running = false;
var count = 1;
var onFinish = [];

console.log('TAP version 13');

module.exports = function test (name, opts, fn) {
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }

    queue.push(function () {
        console.log('# ' + name);
        if (opts.skip) return console.log('# SKIP');
        var onend = null;
        var failed = false;
        var t = {
            on: function (name, fn) {
                if (name === 'end') onend = fn;
            },
            end: function () {
                if (failed) console.log('not ok ' + count + ' ' + failed)
                else console.log('ok ' + count);
                count++
                onend();
                if (queue.length) queue.shift()()
                else {
                    running = false;
                    for (var i = 0; i < onFinish.length; i++) {
                        onFinish[i]();
                    }
                    onFinish = [];
                }
            },
            fail: function (err) {
                failed = err || true;
            }
        };
        running = true;
        fn(t);
    });

    if (!running) queue.shift()();
}
module.exports.onFinish = function (fn) {
    onFinish.push(fn);
};
