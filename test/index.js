var crel = require('../'),
    test = require('tape');

// All tests in message - test function pairs
const tests = {
    // -- Test element creation --
    'Create an element with no arguments': (t) => {
        t.plan(2);

        var testElement = crel('div');

        t.ok(testElement instanceof HTMLElement,
            'element is an instance of `HTMLElement`');
        t.equal(testElement.tagName, 'DIV',
            'element is an instance of `div`');
    },
    'Create an element with no arguments, using an invalid tag name': (t) => {
        t.plan(2);

        var testElement = crel('invalidtagname');

        t.ok(testElement instanceof HTMLUnknownElement,
            'element is an instance of `HTMLUnknownElement `');
        t.equal(testElement.tagName, 'INVALIDTAGNAME',
            'element is an instance of `invalidtagname`');
    },
    'Crel doesn\'t modify existing elements if not instructed': (t) => {
        t.plan(1);

        var testElement = document.createElement('div');
        var testedElement = crel(testElement);

        t.ok(testElement.isSameNode(testedElement),
            'element is still the same');
    },
    // -- Test attribute handling --
    'Create an element with simple attributes': (t) => {
        t.plan(2);

        var testElement = crel('div', {class: 'test', id: 'test'});

        t.equal(testElement.className, 'test',
            'element has a `test` class');
        t.equal(testElement.getAttribute('id'), 'test',
            'element has a `test` id');
    },
    'Add attributes to an already existing element': (t) => {
        t.plan(2);

        var testElement = document.createElement('div');
        crel(testElement, {class: 'test', id: 'test'});

        t.equal(testElement.className, 'test',
            'element has a `test` class');
        t.equal(testElement.getAttribute('id'), 'test',
            'element has a `test` id');
      },
      'Modify attributes of an already existing element': (t) => {
          t.plan(2);

          var testElement = document.createElement('div');
          testElement.setAttribute('class', 'test');
          testElement.setAttribute('id', 'test');
          crel(testElement, {class: 'testier', id: 'testier'});

          t.equal(testElement.getAttribute('class'), 'testier',
              'elements class was changed');
          t.equal(testElement.getAttribute('id'), 'testier',
              'elements id was changed');
      },
      'Add an `onEvent` property to an element': (t) => {
          t.plan(1);

          var testElement = crel('button', {
              onclick: function () {
                  t.pass('onClick event triggered');
              }
          });

          testElement.click();
      },
      'Add an `onEvent` property to an element through attribute mapping': (t) => {
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
      },
      // -- Test child node handling --
      'Create an element with a child element': (t) => {
          t.plan(2);

          var testElement = crel('div', document.createElement('p'));

          t.equal(testElement.childNodes.length, 1,
              'element has a child element');
          t.equal(testElement.childNodes[0].tagName, 'P',
              'child element is an instance of `p`');
      },
      'Create an element with a child text node': (t) => {
          t.plan(2);

          var testElement = crel('div', document.createTextNode('test'));

          t.equal(testElement.childNodes.length, 1,
              'element has a child element');
          t.equal(testElement.childNodes[0].nodeType, 3,
              'child element is a text node');
      },
      'Create an element with an array of children': (t) => {
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
      },
      'Create an element with a deep array of children': (t) => {
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
      }
};

for (const message in tests) {
    test(message, tests[message]);
}

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
test('Test that the Proxy API works', function (t) {
    if (typeof Proxy === 'undefined') {
        t.plan(1)
        t.pass('Proxies are not supported in the current environment');
    } else {
        // I'm not proficient with proxies, so
        // TODO: Add #moar-tests
    t.plan(4);

        var testElement = crel.proxy.div({'class': 'test'},
            crel.proxy.span('test'));

        t.equal(testElement.className, 'test');
    t.equal(testElement.childNodes.length, 1);
    t.equal(testElement.childNodes[0].tagName, 'SPAN');
    t.equal(testElement.childNodes[0].textContent, 'test');
    }
});

// -- Test the Proxy APIs features --
test('Test the proxy APIs tag transformations', (t) => {
    t.plan(4);

    crel.tagTransform = (key) => key.replace(/([0-9a-z])([A-Z])/g, '$1-$2').toLowerCase();
    let testElement = crel.myTable(crel.span('test'));

    t.equal(testElement.tagName, 'MY-TABLE',
        'tagname had dashes added to it');
    t.equal(testElement.childNodes.length, 1);
    t.equal(testElement.childNodes[0].tagName, 'SPAN');
    t.equal(testElement.childNodes[0].textContent, 'test');
});
