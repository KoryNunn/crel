![crel](logo.png)

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

# What

A small, simple, and fast DOM creation utility

# Why

Writing HTML is stupid. It's slow, messy, and should not be done in JavaScript.

The best way to make DOM elements is via `document.createElement`, but making lots of them with it is tedious.

Crel makes this process easier.

Inspiration was taken from [laconic](https://github.com/joestelmach/laconic), but Crel wont screw with your bad in-DOM event listeners, and it's smaller,
faster, etc...

# Changelog

[View changelog](https://changelogit.korynunn.com/#korynunn/crel)

# Installing

For browserify:

```bash
npm i crel
```

```javascript
let crel = require('crel');
```

For AMD:

```javascript
require.config({paths: { crel: 'https://cdnjs.cloudflare.com/ajax/libs/crel/4.0.1/crel.min' }});
require(['crel'], (crel) => {
    // Your code
});
```

Using ES6+:

```javascript
import crel from 'crel';
```

For standard script tag style:

```html
<script src="crel.min.js"></script>
```

# Usage

Syntax:

```javascript
// Returns a DOM element
crel(tagName / domElement, attributes, child1, child2, childN);
```

where `childN` may be:

- a DOM element,
- a string, which will be inserted as a `textNode`,
- `null`, which will be ignored, or
- an `Array` containing any of the above

## Examples

```javascript
let element = crel('div',
    crel('h1', 'Crello World!'),
    crel('p', 'This is crel'),
    crel('input', { type: 'number' })
);

// Do something with 'element'
```

You can add attributes that have dashes or reserved keywords in the name, by using strings for the objects keys:

```javascript
crel('div', { 'class': 'thing', 'data-attribute': 'majigger' });
```

You can define custom functionality for certain keys seen in the attributes
object:

```javascript
crel.attrMap['on'] = (element, value) => {
    for (let eventName in value) {
        element.addEventListener(eventName, value[eventName]);
    }
};
// Attaches an onClick event to the img element
crel('img', { on: {
    click: () => {
        console.log('Clicked');
    }
}});
```

You can pass already available elements to Crel to modify their attributes / add child elements to them

```javascript
crel(document.body, crel('h1', 'Page title'));
```

You can assign child elements to variables during creation:

```javascript
let button;
let wrapper = crel('div',
    button  = crel('button')
);
```

You could probably use Crel to rearrange existing DOM elements..

```javascript
crel(someDiv, crel(someOtherDiv, anotherOne));
```

_But don't._

# Proxy support

If you are using Crel in an environment that supports Proxies, you can also use the new API:

```javascript
let crel = require('crel').proxy;

let element = crel.div(
    crel.h1('Crello World!'),
    crel.p('This is crel'),
    crel.input({ type: 'number' })
);
```

# Browser support

Crel uses ES6 features, so it'll work in all evergreen browsers.

# Goals

### Easy to use & Tiny

Less than 1K minified, about 500 bytes gzipped === **Smal**

### Fast

Crel is fast.
Depending on what browser you use, it is up there with straight `document.createElement` calls: http://jsperf.com/dom-creation-libs/10

# License

**MIT**

[npm-image]: https://img.shields.io/npm/v/crel.svg?style=flat-square
[npm-url]: https://npmjs.org/package/crel
[downloads-image]: http://img.shields.io/npm/dm/crel.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/crel
