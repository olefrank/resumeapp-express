'use strict';

module.exports = function CustomError(message, status) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
};

require('util').inherits(module.exports, Error);