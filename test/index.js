var crel = require('../');
var test = require('tape');

test('Create a "div" element', function (t) {
  t.plan(1);

  var testElement = crel('div', {'class': 'thing'});

  t.equal(
    testElement.tagName,
    'DIV'
  );

  t.end();
});

test('Create a "div" element with a "class" attribute', function (t) {
  t.plan(1);

  var testElement = crel('div', {'class': 'thing'});

  t.equal(
    testElement.className,
    'thing'
  );

  t.end();
});

test('Create a "div" element with a "style" attribute', function (t) {
  t.plan(1);

  var testElement = crel('div', {'style': {'color': 'red'}});

  t.equal(
    testElement.style.color,
    'red'
  );

  t.end();
});

test('Create a "div" element with a child element', function (t) {
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

test('Append a text node to an already existing element', function (t) {
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

test('Append an array of children to an element', function (t) {
  t.plan(1);

  var testElement = crel('div', [1, 2, 3]);

  t.equal(
    testElement.childNodes.length,
    3
  );

  t.end();
});

test('Append a deep array of children to an element', function (t) {
  t.plan(1);

  var testElement = crel('div', [[1, 2, 3], [4, 5]]);

  t.equal(
    testElement.childNodes.length,
    5
  );

  t.end();
});

test('Add attributes to an already existing element', function (t) {
  t.plan(2);

  var existing = document.createElement('div');
  var testElement = crel(existing, {'class': 'thing'});

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

test('Check that "isElement" is defined and works', function (t) {
  t.plan(2);

  var element = document.createElement('div');
  var textNode = document.createTextNode('text');

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

test('Check that "isNode" is defined and works', function (t) {
  t.plan(2);

  var element = document.createElement('div');
  var textNode = document.createTextNode('text');

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

test('Add "onevent" functions to an element', function (t) {
  t.plan(1);

  var clickNode = crel('button', {
    onclick: function () {
      t.pass('Event triggered');
    }
  });

  clickNode.click();

  t.end();
});

if (typeof Proxy !== 'undefined') {
  test('Check that the proxy API is defined and works', function (t) {
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
