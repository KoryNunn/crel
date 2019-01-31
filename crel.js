/* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is formatted for run-speed and to assist compilers.
This might make it harder to read at times, but the code's intention should be transparent. */

// IIFE our function
((exporter) => {
    // These strings are used multiple times, so this makes things smaller once compiled
    const func = 'function',
        isNodeString = 'isNode',
        proxyString = 'proxy',
        d = document,
        // Helper functions used throughout the script
        isType = (object, type) => typeof object === type,
        // Recursively appends children to given element. As a text node if not already an element
        appendChild = (element, child) => {
            if (child !== null) {
                if (Array.isArray(child)) { // Support (deeply) nested child elements
                    child.map(subChild => appendChild(element, subChild));
                } else {
                    if (!crel[isNodeString](child)) {
                        child = d.createTextNode(child);
                    }
                    element.appendChild(child);
                }
            }
        },
        // Define our function as a proxy interface
        crel = new Proxy(function (element, settings) {
            // Define all used variables / shortcuts here, to make things smaller once compiled
            let args = arguments, // Note: assigned to a variable to assist compilers.
                index = 1,
                key,
                attribute;
            // If first argument is an element, use it as is, otherwise treat it as a tagname
            element = crel.isElement(element) ? element : d.createElement(element);
            // Check if second argument is a settings object
            if (isType(settings, 'object') && !crel[isNodeString](settings) && !Array.isArray(settings)) {
                // Don't treat settings as a child
                index++;
                // Go through settings / attributes object, if it exists
                for (key in settings) {
                    // Store the attribute into a variable, before we potentially modify the key
                    attribute = settings[key];
                    // Get mapped key / function, if one exists
                    key = crel.attrMap[key] || key;
                    // Note: We want to prioritise mapping over properties
                    if (isType(key, func)) {
                        key(element, attribute);
                    } else if (isType(attribute, func)) { // ex. onClick property
                        element[key] = attribute;
                    } else {
                        // Set the element attribute
                        element.setAttribute(key, attribute);
                    }
                }
            }
            // Loop through all arguments, if any, and append them to our element if they're not `null`
            for (; index < args.length; index++) {
                appendChild(element, args[index]);
            }

            return element;
        }, {// Binds specific tagnames to crel function calls with that tag as the first argument
            get: (target, key) => {
                if (key in target) {
                    return target[key];
                }
                if (!(key in target[proxyString])) {
                    target[proxyString][key] = target.bind(null, key);
                }
                return target[proxyString][key];
            }
        });
    // Used for mapping attribute keys to custom functionality, or to supported versions in bad browsers
    crel.attrMap = {};
    crel.isElement = object => object instanceof Element;
    crel[isNodeString] = node => node instanceof Node;
    // Bound functions are "cached" here for legacy support and to keep Crels internal structure clean
    crel[proxyString] = new Proxy({}, { get: (target, key) => target[key] || crel[key] });
    // Export crel
    exporter(crel, func);
})((product, func) => {
    if (typeof exports === 'object') {
        // Export for Browserify / CommonJS format
        module.exports = product;
    } else if (typeof define === func && define.amd) {
        // Export for RequireJS / AMD format
        define(() => product);
    } else {
        // Export as a 'global' function
        this.crel = product;
    }
});
