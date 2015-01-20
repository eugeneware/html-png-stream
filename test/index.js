var expect = require('expect.js'),
    fs = require('fs'),
    sizeOf = require('image-size'),
    stream = require('stream'),
    path = require('path'),
    htmlPngStream = require('..');

describe('html-png-stream', function() {
  it('should be able to render basic HTML', function(done) {
    this.timeout(0);

    var ps = htmlPngStream();
    var rs = stream.Readable();
    rs._read = function () {};
    rs.pipe(ps);
    ps.on('data', function (data) {
      expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
    });
    ps.on('end', done);

    rs.push('<b>Hello</b>');
    rs.push(null);
  });

  it('should be able to render multiple HTML chunks', function(done) {
    this.timeout(0);

    var ps = htmlPngStream();
    var rs = stream.Readable();
    rs._read = function () {};
    rs.pipe(ps);

    var count = 0;
    var last = new Buffer(0);
    ps.on('data', function (data) {
      expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
      expect(data).to.not.eql(last);
      last = data;
      count++;
    });
    ps.on('end', function () {
      expect(count).to.equal(3);
      done();
    });

    rs.push('<b>Hello</b>');
    rs.push('<b>Goodbye</b>');
    rs.push('<b>Farewell!</b>');
    rs.push(null);
  });

  it('should be able to render a custom image size', function(done) {
    this.timeout(0);

    var ps = htmlPngStream({ width: 1280, height: 720 });
    var rs = stream.Readable();
    rs._read = function () {};
    rs.pipe(ps);
    ps.on('data', function (data) {
      expect(sizeOf(data)).to.eql({ width: 1280, height: 720, type: 'png' });
    });
    ps.on('end', done);

    rs.push('<b>Hello</b>');
    rs.push(null);
  });

  it('should be able to render from a URL', function(done) {
    this.timeout(0);

    var ps = htmlPngStream({});
    var rs = stream.Readable();
    rs._read = function () {};
    rs.pipe(ps);
    ps.on('data', function (data) {
      expect(sizeOf(data)).to.eql({ width: 640, height: 480, type: 'png' });
    });
    ps.on('end', done);

    var filePath = path.join(__dirname, 'fixtures', 'hello.html');
    rs.push('file:' + filePath);
    rs.push(null);
  });
});
