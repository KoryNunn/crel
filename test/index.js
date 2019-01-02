var crel = require('../'),
    test = require('tape');

test('Create an element with no arguments', function (t) {
    t.plan(1);

    var testElement = crel('div');

    t.equal(testElement.tagName, 'DIV');

    t.end();
});

test('Create an element with simple attributes', function (t) {
    t.plan(1);

    var testElement = crel('div', {'class': 'test'});

    t.equal(testElement.className, 'test');

    t.end();
});

test('Create an element with a child element', function (t) {
    t.plan(2);

    var testElement = crel('div', crel('span'));

    t.equal(testElement.childNodes.length, 1);
    t.deepEqual(testElement.childNodes[0].tagName, 'SPAN');

    t.end();
});

test('Create an element with an array of children', function (t) {
    t.plan(1);

    var testElement = crel('div', [1, 2, 3]);

    t.equal(testElement.childNodes.length, 3);

    t.end();
});

test('Create an element with a deep array of children', function (t) {
    t.plan(1);

    var testElement = crel('div', [[1, 2, 3]]);

    t.equal(testElement.childNodes.length, 3);

    t.end();
});

test('Add attributes to an already existing element', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    crel(testElement, {'class': 'test'});

    t.equal(testElement.className, 'test');
    t.equal(testElement.tagName, 'DIV');

    t.end();
});

test('Test that `isELement` is defined and works', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    var testNode = document.createTextNode('test');

    t.ok(
        crel.isElement(testElement),
        'a <div> is an element'
    );

    t.notOk(
        crel.isElement(testNode),
        'a textNode is not an element'
    );

    t.end();
});

test('Test that `isNode` is defined and works', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    var testNode = document.createTextNode('test');

    t.ok(
        crel.isNode(testElement),
        'a <div> is a node'
    );

    t.ok(
        crel.isNode(testNode),
        'a textNode is a node'
    );

    t.end();
});

test('Create an element with a child text node', function (t) {
    t.plan(1);

    var testElement = crel('div', document.createTextNode('test'));

    t.equal(testElement.childNodes.length, 1);

    t.end();
});

test('Add an `onEvent` property to an element', function (t) {
    t.plan(1);

    var testElement = crel('button', {
        onclick: function () {
            t.pass('onClick event triggered');
        }
    });

    testElement.click();

    t.end();
});

if (typeof Proxy !== 'undefined') {
    test('Test that the Proxy API is defined and works', function (t) {
        t.plan(4);

        var proxyCrel = crel.proxy;

        var testElement = proxyCrel.div({class: 'test'},
                proxyCrel.span('test'));

        t.equal(testElement.className, 'test');
        t.equal(testElement.childNodes.length, 1);
        t.equal(testElement.childNodes[0].tagName, 'SPAN');
        t.equal(testElement.childNodes[0].textContent, 'test');

        t.end();
    });
}
