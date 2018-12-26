/* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is not formatted for readability, but rather run-speed and to assist compilers.
However, the code's intention should be transparent. */

(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.crel = factory();
  }
}(this, function () {
  // A helper function used throughout the script, so declare it early
  var isType = function (a, type) {
    return typeof a === type;
  };
  var fn = 'function';
  var obj = 'object';
  var nodeType = 'nodeType';
  var textContent = 'textContent';
  var setAttribute = 'setAttribute';
  var attrMapString = 'attrMap';
  var isNodeString = 'isNode';
  var isElementString = 'isElement';
  var d = isType(document, obj) ? document : {};
  var isNode = isType(Node, fn) ? function (object) {
    return object instanceof Node;
  }
    // in IE <= 8 Node is an object, obviously..
    : function (object) {
      return object &&
        isType(object, obj) &&
        (nodeType in object) &&
        isType(object.ownerDocument, obj);
    };
  var isElement = function (object) {
    return crel[isNodeString](object) && object[nodeType] === 1;
  };
  var isArray = function (a) {
    return a instanceof Array;
  };
  var appendChild = function (element, child) {
    if (isArray(child)) {
      child.map(function (subChild) {
        appendChild(element, subChild);
      });
      return;
    }
    if (!crel[isNodeString](child)) {
      child = d.createTextNode(child);
    }
    element.appendChild(child);
  };

  function crel () {
    var args = arguments; // Note: assigned to a variable to assist compilers.
    var element = args[0];
    var attrMap = crel[attrMapString];

    element = crel[isElementString](element) ? element : d.createElement(element);

    var processAttributes = function (settings) {
      for (var key in settings) {
        key = attrMap[key] ? attrMap[key] : key;
        if (isType(key, fn)) {
          key(element, settings[key]);
        } else if (isType(settings[key], fn)) {
          element[key] = settings[key];
        } else if (isType(settings[key], obj)) {
          // We only check and allow for one level of object depth
          for (var value in settings[key]) {
            element[key][value] = settings[key][value];
          }
        } else {
          element[setAttribute](key, settings[key]);
        }
      }
    };

    var processArgs = function (arg) {
      if (isType(arg, 'string')) {
        element[textContent] = arg;
      } else if (isArray(arg) || isNode(arg) || crel[isElementString](arg)) {
        appendChild(element, arg);
      } else {
        processAttributes(arg);
      }
    };

    for (var i = 1; i < args.length; i++) {
      processArgs(args[i]);
    }

    return element;
  }

  // Used for mapping one kind of attribute to the supported version of that in bad browsers.
  crel[attrMapString] = {};

  crel[isElementString] = isElement;

  crel[isNodeString] = isNode;

  if (!isType(Proxy, 'undefined')) {
    crel.proxy = new Proxy(crel, {
      get: function (target, key) {
        !(key in crel) && (crel[key] = crel.bind(null, key));
        return crel[key];
      }
    });
  }

  return crel;
}));
