/* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is formatted for run-speed and to assist compilers.
This might make it harder to read at times, but the code's intention should be transparent. */

// IIFE our function
(((root, factory) => {
    if (typeof exports === 'object') {
        // Export for Browserify / CommonJS format
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // Export for RequireJS / AMD format
        define(factory);
    } else {
        // Export as a 'global' function
        root.crel = factory();
    }
})(this, () => {
    // Define our function and its properties
    // These strings are used multiple times, so this makes things smaller once compiled
    var func = 'function',
        obj = 'object',
        setAttribute = 'setAttribute',
        attrMapString = 'attrMap',
        isNodeString = 'isNode',
        isElementString = 'isElement',
        d = document,
        // Helper functions used throughout the script
        isType = (object, type) => typeof object === type,
        isNode = (node) => node instanceof Node,
        isElement = (object) => object instanceof Element,
        // Recursively appends children to given element. As a text node if not already an element
        appendChild = (element, child) => {
            if (Array.isArray(child)) { // Support (deeply) nested child elements
                child.map((subChild) => appendChild(element, subChild));
                return;
            }
            if (!crel[isNodeString](child)) {
                child = d.createTextNode(child);
            }
            element.appendChild(child);
        };
    //
    function crel (element) {
        // Define all used variables / shortcuts here, to make things smaller once compiled
        var args = arguments, // Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            argumentsLength = args.length,
            settings = args[1],
            currentIndex = 2,
            child,
            attributeMap = crel[attrMapString];
        // If first argument is an element, use it as is, otherwise treat it as a tagname
        element = crel[isElementString](element) ? element : d.createElement(element);
        // Skip unnecessary checks if there are no additional arguments
        if (argumentsLength > 1) {
            // Check if settings is an attribute object, and if not include it in our loop bellow
            if (!isType(settings, obj) || crel[isNodeString](settings) || Array.isArray(settings)) {
                currentIndex--;
                settings = null;
            }
            // Shortcut if there is only one child that is a string
            if ((argumentsLength - currentIndex) === 1 && isType(args[currentIndex], 'string')) {
                element.textContent = args[currentIndex];
            } else {
                // Loop through all remaining arguments and append them to our element
                for (; currentIndex < argumentsLength; currentIndex++) {
                    child = args[currentIndex];
                    // Ignore null arguments
                    if (child !== null) {
                        appendChild(element, child);
                    }
                }
            }
            // Go through settings / attributes object, if it exists
            for (var key in settings) {
                // Store the attribute into a variable, before we potentially modify the key
                var attribute = settings[key];
                // Get mapped key / function, if one exists
                key = attributeMap[key] || key;
                // Note: We want to prioritise mapping over properties
                if (isType(key, func)) {
                    key(element, attribute);
                } else if (isType(attribute, func)) { // ex. onClick property
                    element[key] = attribute;
                } else {
                    // Set the element attribute
                    element[setAttribute](key, attribute);
                }
            }
        }

        return element;
    }

    // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality
    crel[attrMapString] = {};
    crel[isElementString] = isElement;
    crel[isNodeString] = isNode;
    // Expose proxy interface, if supported
    if (!isType(Proxy, 'undefined')) {
        crel.proxy = new Proxy(crel, {
            get: (target, key) => {
                !(key in crel) && (crel[key] = crel.bind(null, key));
                return crel[key];
            }
        });
    }

    return crel;
}));
