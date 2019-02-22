const test = require('tape');
const crel = require('../crel.js');

// All tests inside a handy object list format
const tests = [
    // -- Test element creation --
    {
        message: 'Create an element with no arguments',
        test: (t, crel) => {
            let testElement = crel('div');

            t.ok(testElement instanceof HTMLElement,
                'element is an instance of `HTMLElement`');
            t.equal(testElement.tagName, 'DIV',
                'element is an instance of `div`');
        },
        checks: 2,
        proxyable: true
    },
    {
        message: 'Create an element with no arguments, using an invalid tag name',
        test: (t, crel) => {
            let testElement = crel('invalidtagname');

            t.ok(testElement instanceof HTMLUnknownElement,
                'element is an instance of `HTMLUnknownElement `');
            t.equal(testElement.tagName, 'INVALIDTAGNAME',
                'element is an instance of `invalidtagname`');
        },
        checks: 2,
        proxyable: true
    },
    {
        message: 'Crel doesn\'t modify existing elements if not instructed',
        test: (t, crel) => {
            let testElement = document.createElement('div');
            let testedElement = crel(testElement);

            t.ok(testElement.isSameNode(testedElement),
                'element is still the same');
        },
        checks: 1,
        proxyable: false
    },
    // -- Test attribute handling --
    {
        message: 'Create an element with simple attributes',
        test: (t, crel) => {
            let testElement = crel('div', {class: 'test', id: 'test'});

            t.equal(testElement.className, 'test',
                'element has a `test` class');
            t.equal(testElement.getAttribute('id'), 'test',
                'element has a `test` id');
        },
        checks: 2,
        proxyable: true
    },
    {
        message: 'Add attributes to an already existing element',
        test: (t, crel) => {
            let testElement = document.createElement('div');
            crel(testElement, {class: 'test', id: 'test'});

            t.equal(testElement.className, 'test',
                'element has a `test` class');
            t.equal(testElement.getAttribute('id'), 'test',
                'element has a `test` id');
        },
        checks: 2,
        proxyable: false
    },
    {
        message: 'Modify attributes of an already existing element',
        test: (t, crel) => {
            let testElement = document.createElement('div');
            testElement.setAttribute('class', 'test');
            testElement.setAttribute('id', 'test');
            crel(testElement, {class: 'testier', id: 'testier'});

            t.equal(testElement.getAttribute('class'), 'testier',
                'elements class was changed');
            t.equal(testElement.getAttribute('id'), 'testier',
                'elements id was changed');
        },
        checks: 2,
        proxyable: false
    },
    {
        message: 'Add an `onEvent` property to an element',
        test: (t, crel) => {
            let testElement = crel('button', {
                onclick: () => {
                    t.pass('onClick event triggered');
                }
            });

            testElement.click();
        },
        checks: 1,
        proxyable: true
    },
    {
        message: 'Add an `onEvent` property to an element through attribute mapping',
        test: (t, crel) => {
            crel.attrMap.on = (element, value) => {
                for (const eventName in value) {
                    element.addEventListener(eventName, value[eventName]);
                }
            };

            let testElement = crel('img', { on: {
                click: () => {
                    t.pass('onClick event triggered');
                }
            }});

            testElement.click();
        },
        checks: 1,
        proxyable: false
    },
    // -- Test child node handling --
    {
        message: 'Create an element with a child element',
        test: (t, crel) => {
            let testElement = crel('div', document.createElement('p'));

            t.equal(testElement.childNodes.length, 1,
                'element has a child element');
            t.equal(testElement.childNodes[0].tagName, 'P',
                'child element is an instance of `p`');
        },
        checks: 2,
        proxyable: true
    },
    {
        message: 'Create an element with a child text node',
        test: (t, crel) => {
            let testElement = crel('div', document.createTextNode('test'));

            t.equal(testElement.childNodes.length, 1,
                'element has a child element');
            t.equal(testElement.childNodes[0].nodeType, 3,
                'child element is a text node');
        },
        checks: 2,
        proxyable: true
    },
    {
        message: 'Create an element with an array of children',
        test: (t, crel) => {
            // TODO: make these more compact / robust
            const testArray = [document.createElement('p'), document.createTextNode('I\'m a text node!'), 'I will be a text node!'];
            let testElement = crel('div', testArray);

            t.equal(testElement.childNodes.length, 3,
                'element has three children');
            t.equal(testElement.childNodes[0].tagName, 'P');
            t.equal(testElement.childNodes[1].nodeType, 3);
            t.equal(testElement.childNodes[1].textContent, 'I\'m a text node!');
            t.equal(testElement.childNodes[2].nodeType, 3);
            t.equal(testElement.childNodes[2].textContent, 'I will be a text node!');
        },
        checks: 6,
        proxyable: true
    },
    {
        message: 'Create an element with a deep array of children',
        test: (t, crel) => {
            // TODO: make these more compact / robust
            const testArray = [document.createElement('p'), document.createTextNode('I\'m a text node!'), 'I will be a text node!'];
            let testElement = crel('div', [[testArray]]);

            t.equal(testElement.childNodes.length, 3,
                'element has three children');
            t.equal(testElement.childNodes[0].tagName, 'P');
            t.equal(testElement.childNodes[1].nodeType, 3);
            t.equal(testElement.childNodes[1].textContent, 'I\'m a text node!');
            t.equal(testElement.childNodes[2].nodeType, 3);
            t.equal(testElement.childNodes[2].textContent, 'I will be a text node!');
        },
        checks: 6,
        proxyable: true
    },
    // -- Test the Proxy APIs features --
    {
        message: 'Test the proxy APIs tag transformations',
        test: (t, crel) => {
            crel.tagTransform = (key) => key.replace(/([0-9a-z])([A-Z])/g, '$1-$2').toLowerCase();
            let testElement = crel.myTable(crel.span('test'));

            t.ok(testElement.isEqualNode(crel.proxy.myTable(crel.proxy.span('test'))),
                'proxies produce the same results');
            t.equal(testElement.tagName, 'MY-TABLE',
                'tagname had dashes added to it');
            t.equal(testElement.childNodes.length, 1);
            t.equal(testElement.childNodes[0].tagName, 'SPAN');
            t.equal(testElement.childNodes[0].textContent, 'test');
        },
        checks: 5,
        proxyable: false
    },
    // -- Test exposed methods --
    {
        message: 'Test `isNode` against various arguments',
        test: (t, crel) => {
            if (!crel.isNode) {
                t.end('`isNode` is undefined');
            }

            const testInputInvalid = ['', null, undefined, 'non-empty',
                42, 4.2, {'key': 'value'}, () => { return 'hi'; }];

            const testInputValid = [document,
                document.createElement('div'),
                document.createTextNode('test'),
                document.createElement('invalidtagname'),
                document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                document.createElementNS('http://www.w3.org/1998/mathml', 'element')];

            testInputInvalid.map(value => {
                t.notOk(crel.isNode(value), '`' + value + '` is not a Node');
            });
            testInputValid.map(value => {
                t.ok(crel.isNode(value), '`' + value + '` is a Node');
            });
        },
        checks: 8 + 6, // Test all values in arrays
        proxyable: false
    },
    {
        message: 'Test `isElement` against various arguments',
        test: (t, crel) => {
            if (!crel.isElement) {
                t.end('`isElement` is undefined');
            }

            const testInputInvalid = ['', null, undefined, 'non-empty',
                42, 4.2, {'key': 'value'}, () => { return 'hi'; },
                document.createTextNode('test'), document];

            const testInputValid = [document.createElement('div'),
                document.createElement('invalidtagname'),
                document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                document.createElementNS('http://www.w3.org/1998/mathml', 'element')];

            testInputInvalid.map(value => {
                t.notOk(crel.isElement(value), '`' + value + '` is not an Element');
            });
            testInputValid.map(value => {
                t.ok(crel.isElement(value), '`' + value + '` is an Element');
            });
        },
        checks: 10 + 4, // Test all values in arrays
        proxyable: false
    }
];

let proxyableChecks = 0;

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
