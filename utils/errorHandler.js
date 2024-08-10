const { sendResponse } = require('../utils/responseController');

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    switch (statusCode) {
        case 400:
            return sendResponse(res, 400, message || 'Validation Errors');
        case 404:
            return sendResponse(res, 404, message || 'Not Found');
        case 500:
        default:
            return sendResponse(res, 500, 'Server Error', {}, message);
    }
}

module.exports = errorHandler;
