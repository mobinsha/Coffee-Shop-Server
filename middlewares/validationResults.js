const { validationResult } = require('express-validator');
const {sendResponse} = require("../utils/responseHandler");

function validationResults(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Extract error messages
        const errorMessages = errors.array().map(err => err.msg);
        
        // Join all error messages
        const errorMessage = errorMessages.length > 1 
            ? `${errorMessages.length} خطای اعتبارسنجی وجود دارد`
            : errorMessages[0];
        
        return sendResponse(res, 400, errorMessage, {}, errors.array());
    }
    next()
}

module.exports = {validationResults}
