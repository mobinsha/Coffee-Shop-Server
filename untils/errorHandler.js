const {sendResponse} = require('../untils/responseController');

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500
    const message = err.message || 'خطای سرور'

    switch (statusCode) {
        case 400:
            return sendResponse(res, 400, message || 'خطاهای اعتبارسنجی');
        case 404:
            return sendResponse(res, 404, message);
        case 500:
        default:
            return sendResponse(res, 500, 'خطای سرور', {}, message);
    }
}

module.exports = errorHandler;
