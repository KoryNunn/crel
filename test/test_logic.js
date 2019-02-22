const test = require('tape');
const crel = require('../crel.js');

let proxyableChecks = 0;
// Tests are sourced in 'test.html' before this file is
for (const value of tests) {
    test(value.message, (t) => {
        t.plan(value.checks);
        value.test(t, crel);
    });

    if (value.proxyable) {
        proxyableChecks += value.checks;
    }
}

test('Rerun all "proxy-able" tests through the Proxy API', (t) => {
    t.plan(proxyableChecks);
    for (const value of tests) {
        if (value.proxyable) {
            value.test(t, (...args) => {
                let tag = args[0];
                args.shift();
                return crel.proxy[tag].apply(this, args);
            });
        }
    }
});
