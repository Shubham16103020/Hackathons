'use strict';

const APIError = require('./api_errors');

module.exports = (() => {
  function ArgumentError(errorMessage) {
    this.message = errorMessage;
  }

  ArgumentError.prototype.constructor = ArgumentError;

  ArgumentError.prototype.asAPIError = function() {
    return new APIError('40030', this);
  };

  return ArgumentError;
})();
