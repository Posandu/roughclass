## @posandu/roughclass

This npm library minifies classnames in HTML files.

From:

```html
<div class="foo bar baz"></div>
```

```css
.foo.bar {
	color: red;
}
.baz {
	opacity: 0;
}
```

To:

```html
<div class="a b c"></div>
```

```css
.a.b {
	color: red;
}
.c {
	opacity: 0;
}
```

## Getting Started

Install using `npm i @posandu/roughclass`.

```js
const minify = require("@posandu/roughclass");
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
