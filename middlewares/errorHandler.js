const { sendResponse } = require('../utils/responseHandler');

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    switch (statusCode) {
        case 400:
            return sendResponse(res, 400, message || 'خطای اعتبارسنجی');
        case 401:
            return sendResponse(res, 401, message || 'نام کاربری یا رمز عبور اشتباه است')
        case 403:
            return sendResponse(res, 403, message || 'دسترسی غیرمجاز. لطفاً دوباره وارد شوید')
        case 404:
            return sendResponse(res, 404, message || 'یافت نشد');
        case 500:
        default:
            return sendResponse(res, 500, 'خطای سرور', {}, message);
    }
}

module.exports = errorHandler;
