var fs = require('fs');
var assert = require('assert');
var request = require('supertest');
var logger = require('..');
var express = require('express');
var url = require('url');

var chars = 'abcdefghijklmnopqrstuvwxyz';
function generateRandomPath() {
  var s = '/';
  for (var i = 0; i < 20; i++) {
    s += chars.charAt(Math.floor(chars.length * Math.random()));
  }
  return s;
}

var content = 'hello world.';
var status = 202;

var tag = 'debug';
var options = { host: '127.0.0.1', port: 24224, timeout: 3.0 };

describe('express-fluent-logger', function() {
  it('specified tag and options', function(callback) {
    var path = generateRandomPath();
    var app = express();
    app.use(logger(tag, options));
    app.get(path, function(req, res) {
      res.status(status).send(content);
    });
    request(app)
      .get(path)
      .expect(status, 'hello world.')
      .end(function(err) {
        if (err) {
          callback(err);
          return;
        }
        assertLog(path, callback);
      });
  });

  it('specified only options', function(callback) {
    var path = generateRandomPath();
    var app = express();
    app.use(logger(options));
    app.get(path, function(req, res) {
      res.status(status).send(content);
    });
    request(app)
      .get(path)
      .expect(status, 'hello world.')
      .end(function(err) {
        if (err) {
          callback(err);
          return;
        }
        assertLog(path, callback);
      });
  });

  it('specified only tag', function(callback) {
    var path = generateRandomPath();
    var app = express();
    app.use(logger(tag));
    app.get(path, function(req, res) {
      res.status(status).send(content);
    });
    request(app)
      .get(path)
      .expect(status, 'hello world.')
      .end(function(err) {
        if (err) {
          callback(err);
          return;
        }
        assertLog(path, callback);
      });
  });

  it('not specified', function(callback) {
    var path = generateRandomPath();
    var app = express();
    app.use(logger());
    app.get(path, function(req, res) {
      res.status(status).send(content);
    });
    request(app)
      .get(path)
      .expect(status, 'hello world.')
      .end(function(err) {
        if (err) {
          callback(err);
          return;
        }
        assertLog(path, callback);
      });
  });
});

function assertLog(path, callback) {
  setTimeout(function () {
    var files = fs.readdirSync('.').filter(function (file) {
      return file.match(/^fluent.log/) !== null;
    });
    if (files.length !== 1) {
      callback('log file is not found.');
      return;
    }
    var logs = fs.readFileSync(files[0], 'utf-8').split('\n');
    var lastLog = logs[logs.length - 2].split('\t');
    var logJson = JSON.parse(lastLog[2]);

    assert.equal(logJson['remote-address'], null);
    assert.equal(url.parse(logJson.url).path, path);
    assert.equal(logJson['content-length'], content.length);
    assert.equal(logJson['http-version'], '1.1');
    assert.equal(logJson.status, status);
    assert.equal(logJson.referrer, '');
    assert.equal(logJson['user-agent'].match(/^node-superagent\//) !== null, true);

    callback();
  }, 100);
}
