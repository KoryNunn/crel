window.crel = (function(undefined){
    var arrayProto = [];
    
    function isNode(object){
        // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
        return (
            typeof Node === "object" ? object instanceof Node : 
            object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName==="string"
        );
    };
    function crel(){
        var document = window.document,
            args = arguments,
            type,
            settings,
            children,
            element;

        // shortcut (approx twice as fast as going through slice.call)
        if(arguments.length === 1){
            return document.createElement(arguments[0]);
        }

        args = arrayProto.slice.call(arguments);
        type = args.shift();
        settings = args.shift();
        children = args;
        element = document.createElement(type);
            
        if(isNode(settings) || typeof settings !== 'object') {
            children = [settings].concat(children); 
            settings = {};
        }
        
        // shortcut if there is only one child that is a string    
        if(children.length === 1 && typeof children[0] === 'string' && element.textContent !== undefined){
            element.textContent = children[0];
        }else{    
            for(var i = 0; i < children.length; i++){
                child = children[i];
                
                if(child == null){
                    continue;
                }
                
                if(!isNode(child)){
                    child = document.createTextNode(child);
                }
                
                element.appendChild(child);
            }
        }

        for(var key in settings){
            element.setAttribute(key, settings[key]);
        }
        
        return element;
    }
    
    // String referenced so that compilers maintain the property name.
    crel["isNode"] = isNode;
    
    return crel;
})();