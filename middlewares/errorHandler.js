const { sendResponse } = require('../utils/responseHandler');

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    switch (statusCode) {
        case 400:
            return sendResponse(res, 400, message || 'Validation Errors');
        case 401:
            return sendResponse(res, 401, message || 'Incorrect password.')
        case 403:
            return sendResponse(res, 403, message || 'Invalid token. Please provide a valid token')
        case 404:
            return sendResponse(res, 404, message || 'Not Found');
        case 500:
        default:
            return sendResponse(res, 500, 'Server Error', {}, message);
    }
}

module.exports = errorHandler;
