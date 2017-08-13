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

test('append array children', function(t) {
    t.plan(1);

    var testElement = crel('div', [1, 2, 3]);

    t.equal(
        testElement.childNodes.length,
        3
    );

    t.end();
});

test('append deep array children', function(t) {
    t.plan(1);

    var testElement = crel('div', [[1, 2, 3]]);

    t.equal(
        testElement.childNodes.length,
        3
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

test('isElement', function(t) {
    t.plan(2);

    var element = document.createElement('div'),
        textNode = document.createTextNode('text');

    t.ok(
        crel.isElement(element),
        'a <div> is an element'
    );

    t.notOk(
        crel.isElement(textNode),
        'a textNode is not an element'
    );

    t.end();
});

test('isNode', function(t) {
    t.plan(2);

    var element = document.createElement('div'),
        textNode = document.createTextNode('text');

    t.ok(
        crel.isNode(element),
        'a <div> is an element'
    );

    t.ok(
        crel.isNode(textNode),
        'a textNode is not an element'
    );

    t.end();
});

test('pass a text node as the first child', function(t) {
    t.plan(1);

    var textNode = document.createTextNode('text');

    var element = crel('div', textNode);

    t.equal(
        element.childNodes.length,
        1,
        'textNode was appended'
    );

    t.end();
});

test('onevent binding', function(t) {
    t.plan(1);

    var clickNode = crel('button', {
        onclick: function(){
            t.pass();
        }
    });

    clickNode.click();

    t.end();
});

if(typeof Proxy !== 'undefined'){

    test('proxy API', function(t) {
        t.plan(4);

        var proxyCrel = crel.proxy;

        var testElement = proxyCrel.div({class: 'foo'},
                proxyCrel.span('bar')
            );

        t.equal(
            testElement.className,
            'foo'
        );

        t.equal(
            testElement.childNodes.length,
            1
        );

        t.equal(
            testElement.childNodes[0].tagName,
            'SPAN'
        );

        t.equal(
            testElement.childNodes[0].textContent,
            'bar'
        );

        t.end();
    });

}