var crel = require('../'),
    test = require('tape');

// -- Test element creation --
test('Create an element with no arguments', function (t) {
    t.plan(2);

    var testElement = crel('div');

    t.ok(testElement instanceof HTMLElement,
        'element is an instance of `HTMLElement`');
    t.equal(testElement.tagName, 'DIV',
        'element is an instance of `div`');
});

test('Create an element with no arguments, using an invalid tag name', function (t) {
    t.plan(2);

    var testElement = crel('invalidtagname');

    t.ok(testElement instanceof HTMLUnknownElement,
        'element is an instance of `HTMLUnknownElement `');
    t.equal(testElement.tagName, 'INVALIDTAGNAME',
        'element is an instance of `invalidtagname`');
});

test('Crel doesn\'t modify existing elements if not instructed', function (t) {
    t.plan(1);

    var testElement = document.createElement('div');
    var testedElement = crel(testElement);

    t.ok(testElement.isSameNode(testedElement),
        'element is still the same');
});

// -- Test attribute handling --
test('Create an element with simple attributes', function (t) {
    t.plan(2);

    var testElement = crel('div', {'class': 'test', id: 'test'});

    t.equal(testElement.className, 'test',
        'element has a `test` class');
    t.equal(testElement.getAttribute('id'), 'test',
        'element has a `test` id');
});

test('Add attributes to an already existing element', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    crel(testElement, {'class': 'test', id: 'test'});

    t.equal(testElement.className, 'test',
        'element has a `test` class');
    t.equal(testElement.getAttribute('id'), 'test',
        'element has a `test` id');
});

test('Modify attributes of an already existing element', function (t) {
    t.plan(2);

    var testElement = document.createElement('div');
    testElement.setAttribute('class', 'test');
    testElement.setAttribute('id', 'test');
    crel(testElement, {'class': 'testier', id: 'testier'});

    t.equal(testElement.getAttribute('class'), 'testier',
        'elements class was changed');
    t.equal(testElement.getAttribute('id'), 'testier',
        'elements id was changed');
});

test('Add an `onEvent` property to an element', function (t) {
    t.plan(1);

    var testElement = crel('button', {
        onclick: function () {
            t.pass('onClick event triggered');
        }
    });

    testElement.click();
});

test('Add an `onEvent` property to an element through attribute mapping', function (t) {
    t.plan(1);

    crel.attrMap.on = function (element, value) {
        for (var eventName in value) {
            element.addEventListener(eventName, value[eventName]);
        }
    };

    var testElement = crel('img', { on: {
        click: function () {
            t.pass('onClick event triggered');
        }
    }});

    testElement.click();
});

// -- Test child node handling --
test('Create an element with a child element', function (t) {
    t.plan(2);

    var testElement = crel('div', document.createElement('p'));

    t.equal(testElement.childNodes.length, 1,
        'element has a child element');
    t.equal(testElement.childNodes[0].tagName, 'P',
        'child element is an instance of `p`');
});

test('Create an element with a child text node', function (t) {
    t.plan(2);

    var testElement = crel('div', document.createTextNode('test'));

    t.equal(testElement.childNodes.length, 1,
        'element has a child element');
    t.equal(testElement.childNodes[0].nodeType, 3,
        'child element is a text node');
});

test('Create an element with an array of children', function (t) {
    t.plan(6);
    // TODO: make these more compact / robust
    var testArray = [document.createElement('p'), document.createTextNode('I\'m a text node!'), 'I will be a text node!'];
    var testElement = crel('div', testArray);

    t.equal(testElement.childNodes.length, 3,
        'element has three children');
    t.equal(testElement.childNodes[0].tagName, 'P');
    t.equal(testElement.childNodes[1].nodeType, 3);
    t.equal(testElement.childNodes[1].textContent, 'I\'m a text node!');
    t.equal(testElement.childNodes[2].nodeType, 3);
    t.equal(testElement.childNodes[2].textContent, 'I will be a text node!');
});

test('Create an element with a deep array of children', function (t) {
    t.plan(6);
    // TODO: make these more compact / robust
    var testArray = [document.createElement('p'), document.createTextNode('I\'m a text node!'), 'I will be a text node!'];
    var testElement = crel('div', [[testArray]]);

    t.equal(testElement.childNodes.length, 3,
        'element has three children');
    t.equal(testElement.childNodes[0].tagName, 'P');
    t.equal(testElement.childNodes[1].nodeType, 3);
    t.equal(testElement.childNodes[1].textContent, 'I\'m a text node!');
    t.equal(testElement.childNodes[2].nodeType, 3);
    t.equal(testElement.childNodes[2].textContent, 'I will be a text node!');
});

// -- Test exposed methods --
test('Test that `isNode` is defined', function (t) {
    // Assign into a variable to help readability
    var isDefined = crel.isNode;

    t.plan(isDefined ? 2 : 1);

    t.ok(isDefined, '`isNode` is defined');

    if (isDefined) {
      // Do further tests
      t.test('Test `isNode` against various arguments', function (ts) {
          var testInputInvalid = ['', null, undefined, 'non-empty',
              42, 4.2, {'key': 'value'}, function () { return 'hi'; }];

          var testInputValid = [document,
              document.createElement('div'),
              document.createTextNode('test'),
              document.createElement('invalidtagname'),
              document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
              document.createElementNS('http://www.w3.org/1998/mathml', 'element')];

          ts.plan(testInputInvalid.lenght + testInputValid.lenght); // Test all values in arrays

          testInputInvalid.map(function (value) {
              ts.notOk(crel.isNode(value), '`' + value + '` is not a Node');
          });
          testInputValid.map(function (value) {
              ts.ok(crel.isNode(value), '`' + value + '` is a Node');
          });
      });
    }
});

test('Test that `isElement` is defined', function (t) {
    // Assign into a variable to help readability
    var isDefined = crel.isElement;

    t.plan(isDefined ? 2 : 1);

    t.ok(isDefined, '`isElement` is defined');

    if (isDefined) {
      // Do further tests
      t.test('Test `isElement` against various arguments', function (ts) {
          var testInputInvalid = ['', null, undefined, 'non-empty',
              42, 4.2, {'key': 'value'}, function () {},
              document.createTextNode('test'), document];

          var testInputValid = [document.createElement('div'),
              document.createElement('invalidtagname'),
              document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
              document.createElementNS('http://www.w3.org/1998/mathml', 'element')];

          ts.plan(testInputInvalid.lenght + testInputValid.lenght); // Test all values in arrays

          testInputInvalid.map(function (value) {
              ts.notOk(crel.isElement(value), '`' + value + '` is not an Element');
          });
          testInputValid.map(function (value) {
              ts.ok(crel.isElement(value), '`' + value + '` is an Element');
          });
      });
    }
});

// -- Test the Proxy API --
test('Test that the Proxy API is defined', function (t) {
    if (typeof Proxy === 'undefined') {
        t.plan(1)
        t.pass('Proxies are not supported in the current environment');
    } else {
        var proxyCrel = crel.proxy;

        t.plan(proxyCrel ? 2 : 1);

        t.ok(proxyCrel, 'The Proxy API is defined');

        if (proxyCrel) {
            // Do further tests
            t.test('Test that the Proxy API works', function (ts) {
                // I'm not proficient with proxies, so
                // TODO: Add #moar-tests
                ts.plan(4);

                var testElement = proxyCrel.div({'class': 'test'},
                    proxyCrel.span('test'));

                ts.equal(testElement.className, 'test');
                ts.equal(testElement.childNodes.length, 1);
                ts.equal(testElement.childNodes[0].tagName, 'SPAN');
                ts.equal(testElement.childNodes[0].textContent, 'test');
            });
        }
    }
});
