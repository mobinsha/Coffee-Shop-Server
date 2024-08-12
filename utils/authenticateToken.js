const {sendResponse} = require("./responseController");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next){
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return sendResponse(res, 401, 'No token provided. Please include a token in the Authorization header.')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return sendResponse(res, 403, 'Invalid token. Please provide a valid token.')
            else {
                req.user = decode
                next()
            }
        })
    }
}

module.exports = {authenticateToken}