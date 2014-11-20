/*
 * express-fluent-logger
 * Copyright(c) 2014 Toshiya SAITOH
 */

var logger = require('fluent-logger');
var debug = require('debug')('express-fluent-logger');

logger.on('error', debug);

/**
 * Create a fluent logger middleware.
 *
 * @public
 * @param {String|Function} tag
 * @param {Object} options
 * @return {Function}
 */
exports = module.exports = function expressFluentLogger(tag, options) {
  if (typeof tag === 'object') {
    options = tag;
    tag = 'debug';
  }

  if (typeof tag === 'undefined') {
    tag = 'debug';
  }

  options = options || { host: '127.0.0.1', port: 24224, timeout: 3.0 };

  logger.configure(tag, options);

  return function(req, res, next) {
    var start = new Date();
    function emitHandler() {
      res.removeListener('finish', emitHandler);
      res.removeListener('close',  emitHandler);
      logger.emit('access', {
        'timestamp':      start.getTime(),
        'remote-address': req.ip,
        'method':         req.method,
        'url':            req.protocol + '://' + req.get('host') + req.url,
        'http-version':   req.httpVersion,
        'status':         res.statusCode,
        'content-length': res.get('content-length'),
        'referrer':       req.get('referrer') || '',
        'user-agent':     req.get('user-agent'),
        'response-time':  new Date() - start
      });
    }

    res.on('finish', emitHandler);
    res.on('close',  emitHandler);
    next();
  }
};
