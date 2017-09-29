# express-fluent-logger

[![NPM Version](https://img.shields.io/npm/v/express-fluent-logger.svg?style=flat)](https://npmjs.org/package/express-fluent-logger)
[![NPM Downloads](https://img.shields.io/npm/dm/express-fluent-logger.svg?style=flat)](https://npmjs.org/package/express-fluent-logger)
[![Build Status](https://travis-ci.org/stoshiya/express-fluent-logger.svg?branch=master)](https://travis-ci.org/stoshiya/express-fluent-logger)
[![Test Coverage](https://img.shields.io/coveralls/stoshiya/express-fluent-logger.svg?style=flat)](https://coveralls.io/r/stoshiya/express-fluent-logger?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/stoshiya/express-fluent-logger.svg?style=flat)](https://codeclimate.com/github/stoshiya/express-fluent-logger)
[![NPM Dependency](https://img.shields.io/david/stoshiya/express-fluent-logger.svg?style=flat)](https://david-dm.org/stoshiya/express-fluent-logger)
[![Known Vulnerabilities](https://snyk.io/test/github/stoshiya/express-fluent-logger/badge.svg)](https://snyk.io/test/github/stoshiya/express-fluent-logger)

access logger middleware using fluentd for express.js

## Install
```sh
$ npm install express-fluent-logger
```

## Example
```js
var app = require('express')();
var logger = require('express-fluent-logger');

app.use(logger());

app.get('/', function(req, res) {
  res.send('hello world!');
});

app.listen(3000);
```

## Parameters
 - **tag**: String of tag name on fluentd. (default: `debug`)
 - **options**: Object of fluentd connection. (default: `{ host: '127.0.0.1', port: 24224, timeout: 3.0 }`)

## Logging HTTP response headers
This middleware will record the http response header, if you specify `options.responseHeaders` as following.
```js
var app = require('express')();
var logger = require('express-fluent-logger');

app.use(logger('tagName', { host: '127.0.0.1', port: 24224, timeout: 3.0, responseHeaders: ['x-userid'] }));

app.get('/', function(req, res) {
  res.send('hello world!');
});

app.listen(3000);

```

## Test
```sh
$ fluentd -c test/fluent.conf &
$ npm test
```

## License

[MIT](http://stoshiya.mit-license.org/2014)


## About NodeJS version

This package is compatible with NodeJS versions >= 4.

