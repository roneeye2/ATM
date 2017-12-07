function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "text/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.head.appendChild(jsElm);
}

function loadStyle(file) {
    // DOM: Create the style element
    var styleElm = document.createElement("style");
    // set the relation attribute
    styleElm.rel = "stylesheet";
    // make the href element load file
    styleElm.href = file;
    // finally insert the element to the header element in order to load the script
    document.head.appendChild(styleElm);
}

