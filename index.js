var stream = require('stream'),
    phantomjs = require('phantomjs-bin'),
    webdriver = require('selenium-webdriver');

module.exports = HtmlPngStream;


function HtmlPngStream(opts) {
  if (typeof opts === 'undefined') opts = {};
  opts.browser = opts.browser || 'phantomjs';
  opts.width = opts.width || 640;
  opts.height = opts.height || 480;
  opts.chromeHeight = opts.chromeHeight || 108;

  var driver = new webdriver.Builder()
  .withCapabilities({
     browserName: opts.browser
  })
  .build();

  var resized = false;

  var ts = stream.Transform();
  ts._transform = function (chunk, enc, cb) {
    var self = this;

    var html = chunk.toString('utf8');
      if (!resized) {
        // remove the chrome 'chrome' from the window size
        driver.manage().window().setSize(opts.width,
          opts.height + (opts.browser === 'chrome' ? opts.chromeHeight : 0));
        resized = true;
      }

    driver.executeScript(function (html) {
        var doc = document.open('text/html');
        doc.write(html);
        doc.close();
      }, html);
    driver.takeScreenshot().then(function (data) {
        self.push(new Buffer(data, 'base64'));
        cb();
      });
  };

  ts.once('end', cleanup);
  ts.once('error', cleanup);

  function cleanup() {
    driver && driver.quit();
    driver = null;
  }

  return ts;
}
