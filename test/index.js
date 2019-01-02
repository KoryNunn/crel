var crel = require('../'),
    test = require('tape');

test('create div', function (t) {
    t.plan(1);

    var testElement = crel('div');

    t.equal(testElement.tagName, 'DIV');

    t.end();
});

test('create div with a class', function (t) {
    t.plan(1);

    var testElement = crel('div', {'class': 'test'});

    t.equal(testElement.className, 'test');

    t.end();
});

test('create div with a child', function (t) {
    t.plan(2);

    var testElement = crel('div', crel('span'));

    t.equal(testElement.childNodes.length, 1);
    t.deepEqual(testElement.childNodes[0].tagName, 'SPAN');

    t.end();
});

test('append array children', function (t) {
    t.plan(1);

    var testElement = crel('div', [1, 2, 3]);

    t.equal(testElement.childNodes.length, 3);

    t.end();
});

test('append deep array children', function (t) {
    t.plan(1);

    var testElement = crel('div', [[1, 2, 3]]);

    t.equal(testElement.childNodes.length, 3);

    t.end();
});

test('add attributes to an existing element', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    crel(testElement, {'class': 'test'});

    t.equal(testElement.className, 'test');
    t.equal(testElement.tagName, 'DIV');

    t.end();
});

test('isElement', function (t) {
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

test('isNode', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    var testNode = document.createTextNode('test');

    t.ok(
        crel.isNode(testElement),
        'a <div> is an element'
    );

    t.ok(
        crel.isNode(testNode),
        'a textNode is not an element'
    );

    t.end();
});

test('pass a text node as the first child', function (t) {
    t.plan(1);

    var testElement = crel('div', document.createTextNode('test'));

    t.equal(testElement.childNodes.length, 1);

    t.end();
});

test('onevent binding', function (t) {
    t.plan(1);

    var testElement = crel('button', {
        onclick: function () {
            t.pass();
        }
    });

    testElement.click();

    t.end();
});

if (typeof Proxy !== 'undefined') {
    test('proxy API', function (t) {
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
