## HTML Classes minifier

This node script minifies classnames in HTML files.

From:

```html
<div class="foo bar baz"></div>
```

```css
.foo.bar {
    color:red;
}
.baz {
    opacity:0;
}
```

To:

```html
<div class="a b c"></div>
```

```css
.a.b {
    color:red;
}
.c {
    opacity:0;
}
```

## Getting Started

Clone the repository. Install dependencies. Import `minifier.js` into your project.

```js
const minify = require("minifier.js");
```

## Usage

### minify(css : string , html : string) : object

Returns an object with the minified CSS and HTML.

```js
{
    css: '...',
    html: '...',
    replacedClasses: object
}
```
