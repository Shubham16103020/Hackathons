'use strict';

const APIError = require(`./api_errors`);

module.exports = (res, error) => {
  // const apiError =
    // error instanceof APIError
    //   ? error
    //   : typeof error.asAPIError === 'function'
    //   ? error.asAPIError()
    //   : new APIError('50090', error);
    let apiError;
    if(error instanceof APIError){
      apiError = error;
      console.log(apiError.logMessage + ': ' + apiError.stack || error.stack || '');
    }else if(typeof error.asAPIError === 'function'){
      apiError = error.asAPIError();
      console.log(apiError.logMessage + ': ' + apiError.stack || error.stack || '');
    }else{
      apiError = new APIError('50090');
      console.log(error.logMessage + ': ' + error.stack || '');
    }
  // logger.error(apiError.logMessage + ': ' + apiError.stack || error.stack || '');
  res
    .status(apiError.statusCode)
    .json({ errorCode: apiError.errorCode, errorMessage: apiError.logMessage });
};