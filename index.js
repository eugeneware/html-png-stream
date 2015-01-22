var stream = require('stream'),
    html2png = require('html2png');

module.exports = HtmlPngStream;

var URL_REGEX = /^(http|https|file)\:/;

function HtmlPngStream(opts) {
  if (typeof opts === 'undefined') opts = {};
  opts.browser = opts.browser || 'phantomjs';
  opts.width = opts.width || 640;
  opts.height = opts.height || 480;
  opts.chromeHeight = opts.chromeHeight || 108;

  var screenshot = html2png(opts);

  var ts = stream.Transform();
  ts._transform = function (chunk, enc, cb) {
    var self = this;

    var html = chunk.toString('utf8');
    if (URL_REGEX.test(html)) {
      // is a URL, get it
      screenshot.renderUrl(html, function (err, data) {
        if (err) return cb(err);
        self.push(data);
        cb();
      });
    } else {
      screenshot.render(html, function (err, data) {
        if (err) return cb(err);
        self.push(data);
        cb();
      });
    }
  };

  ts.once('end', cleanup);
  ts.once('error', cleanup);

  function cleanup() {
    screenshot && screenshot.close();
    screenshot = null;
  }

  return ts;
}
