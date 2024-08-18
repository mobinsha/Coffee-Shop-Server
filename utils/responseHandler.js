function sendResponse(res, statusCode, message, data = {}, error = null) {
    res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
        error
    });
}


module.exports = {sendResponse}
