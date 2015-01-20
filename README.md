# html-png-stream

Convert a stream of HTML documents into PNG Buffer Objects

[![build status](https://secure.travis-ci.org/eugeneware/html-png-stream.png)](http://travis-ci.org/eugeneware/html-png-stream)

## Installation

This module is installed via npm:

``` bash
$ npm install html-png-stream
```

## Example Usage

Render some HTML into a PNG Buffer Object

``` js
var htmlPngStream = require('html-png-stream');
var ps = htmlPngStream({ width: 1280, height: 720, browser: 'phantomjs' });
var rs = stream.Readable();
rs._read = function () {};

rs.pipe(ps);

ps.on('data', function (data) {
  // data will contain a screenshot of the HTML as a node.js Buffer
  console.log(data);
  //<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 80 ...>
});

// render some HTML
rs.push('<b>Hello</b>');
```

## API

### htmlPngStream([options])

The constructor is passed an options object:

* `width`, `height` - the width and height of the browser. NB: This is not the
maximum dimensions of each screenshot. So if the rendered page is higher than
`height` the screenshot returned will be the full rendered height of the page.
* `browser` - The browser to use for rendering. By default this is `phantomjs`
and this module bundles together a static binary of phantomjs with
[phantomjs-bin](https://github.com/eugeneware/phantomjs-bin). If you have
Google Chrome installed and `chromedriver` is in your `PATH`, then you can
render with Chrome.

### write(chunk, [enc], [cb])

You can pipe a HTML fragment or a URL to this stream and it will be rendered.
