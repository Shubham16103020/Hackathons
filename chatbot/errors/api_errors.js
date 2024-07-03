'use strict';

const API_RESPONSE_CODES = {
    STATUS_CODES: {
      200: 'Ok',
      201: 'Created',
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      409: 'Conflict',
      429: 'Too Many Requests',
      440: 'Login expired',
      500: 'Server error',
      504: 'Gateway Timeout'
    },
    REASON_CODES: {
      // the first three digits are the corresponding status code; the text will be used in log
      20000: 'Success',
      20100: 'Created',
      40010: 'Invalid request data',
      40020: 'Invalid email address',
      40030: 'Bad argument error',
      40110: 'No API Key provided',
      40120: 'Invalid API Key',
      40130: 'Blocked by access_control',
      40140: 'Blacklisted IP address',
      40150: 'Missing required header',
      40160: 'Invalid value in header',
      40310: 'Client not provisioned to access route',
      40320: 'Missing Authorization header or it is invalid',
      40330: 'Invalid username or password',
      40340: 'Username in header does match login request parameter',
      40350: 'User not provisioned to access resource',
      40410: 'The requested object does not exist',
      40910: 'Conflict in creation',
      42210: 'Unprocessable Entity',
      42910: 'The rate of requests is over provisioned limit',
      44010: 'User token expired',
      50090: 'An error occurred while processing your request. Please try again.',
      50410: 'Public static data fetch failed'
    }
  };
  
module.exports = (() => {
  /**
   *
   * @param reasonCode a string as one of the reasoncode defined in config
   * @param logMessage optional
   * @constructor
   */
  function APIError(reasonCode, originalError, logMessage) {
    this.reasonCode = reasonCode;
    this.statusCode = reasonCode && parseInt(reasonCode.slice(0, 3));
    this.stack = !originalError ? '' : originalError.stack;
    this.errorCode = reasonCode;
    if (logMessage) {
      this.logMessage = `${logMessage}`;
    } else {
      const message = originalError
        ? originalError.message
        : API_RESPONSE_CODES.REASON_CODES[reasonCode];
      this.logMessage = `${message}`;
    }
  }

  APIError.prototype.constructor = APIError;

  return APIError;
})();