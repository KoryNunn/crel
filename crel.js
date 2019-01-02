//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.

*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    var isType = function(object, type){ // A helper function used throughout the script, so declare it early
            return typeof object === type;
        },
        func = 'function',
        obj = 'object',
        setAttribute = 'setAttribute',
        attrMapString = 'attrMap',
        isNodeString = 'isNode',
        isElementString = 'isElement',
        d = document,
        isNode = function (node) {
            return node instanceof Node;
        },
        isElement = function (element) {
            return element instanceof Element;
        },
        appendChild = function(element, child) {
            if (Array.isArray(child)) {
                child.map(function(subChild){
                    appendChild(element, subChild);
                });
                return;
            }
            if(!crel[isNodeString](child)){
                child = d.createTextNode(child);
            }
            element.appendChild(child);
        };


    function crel(element){
        var args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            argumentsLength = args.length,
            settings = args[1],
            currentIndex = 2,
            child,
            attributeMap = crel[attrMapString];

        element = crel[isElementString](element) ? element : d.createElement(element);
        // shortcut
        if(argumentsLength > 1){
            if(!isType(settings,obj) || crel[isNodeString](settings) || Array.isArray(settings)) {
                currentIndex--;
                settings = null;
            }

            // shortcut if there is only one child that is a string
            if((argumentsLength - currentIndex) === 1 && isType(args[currentIndex], 'string')){
                element.textContent = args[currentIndex];
            }else{
                for(; currentIndex < argumentsLength; currentIndex++){
                    child = args[currentIndex];

                    if(child !== null){
                        appendChild(element, child);
                    }
                }
            }

            for(var key in settings){
                if(!attributeMap[key]){
                    if(isType(settings[key],func)){
                        element[key] = settings[key];
                    }else{
                        element[setAttribute](key, settings[key]);
                    }
                }else{
                    var attrKey = attributeMap[key];
                    if(isType(attrKey, func)){
                        attrKey(element, settings[key]);
                    }else{
                        element[setAttribute](attrKey, settings[key]);
                    }
                }
            }
        }

        return element;
    }

    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    crel[attrMapString] = {};

    crel[isElementString] = isElement;

    crel[isNodeString] = isNode;

    if(!isType(Proxy, 'undefined')){
        crel.proxy = new Proxy(crel, {
            get: function(target, key){
                !(key in crel) && (crel[key] = crel.bind(null, key));
                return crel[key];
            }
        });
    }

    return crel;
}));
