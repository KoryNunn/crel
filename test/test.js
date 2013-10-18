var crel = require('../'),
    test = require('tape');

test('create div', function(t) {
    t.plan(1);

    var testElement = crel('div', {'class':'thing'});

    t.equal(
        testElement.tagName,
        'DIV'
    );

    t.end();
});

test('create div with a class', function(t) {
    t.plan(1);

    var testElement = crel('div', {'class':'thing'});

    t.equal(
        testElement.className,
        'thing'
    );

    t.end();
});

test('create div with a child', function(t) {
    t.plan(2);

    var testElement = crel('div',
            crel('span')
        );

    t.equal(
        testElement.childNodes.length,
        1
    );

    t.deepEqual(
        testElement.childNodes[0].tagName,
        'SPAN'
    );

    t.end();
});

test('add attributes to an existing element', function(t) {
    t.plan(2);

    var existing = document.createElement('div'),
        testElement = crel(existing, {'class':'thing'});

    t.equal(
        testElement.className,
        'thing'
    );

    t.equal(
        testElement.tagName,
        'DIV'
    );

    t.end();
});