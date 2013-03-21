crel
====

# What #

a small, simple, and fast DOM creation utility

# Why? #

Writing HTML is stupid. It's slow, messy, and should not be done in JavaScript.

The best way to make DOM elements is via document.createElement, but making lots of DOM with it is tedious.

crel.js makes the process easier.

Inspiration was taken from https://github.com/joestelmach/laconic, but crel wont screw with your bad in-DOM event listeners, and is smaller, faster, etc...

# Usage #

To make some DOM:

    var element = crel('div', 
        crel('h1', 'Crello World!'),
        crel('p', 'This is crel'),
        crel('input', {type: 'number'})
    )
    
    // Do something with 'element'
    
# Goals #

## Easy to use ##

## Tiny ##
(easily less than 1K minified)
## Fast ##

crel is fast. Depending on what browser you use, it is up there with straight document.createElement calls.

http://jsperf.com/dom-creation-libs/10

# License #

MIT
