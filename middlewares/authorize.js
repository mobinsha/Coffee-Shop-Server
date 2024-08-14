const {sendResponse} = require("../utils/responseController");

function authorize(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.permission
        if (!allowedRoles.includes(userRole)) {
           return sendResponse(res, 403, 'Access denied. Insufficient permissions.');
        }
        next();
    }
}

module.exports = { authorize };
