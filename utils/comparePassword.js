const bcrypt = require('bcrypt')
const { SendError } = require('../utils/sendError');

async function comparePassword(inputPassword, userPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, userPassword, (err, isMatch) => {
            if (err) return reject(new SendError(500, err))
            if (!isMatch) return reject(new SendError(401, 'Incorrect password.'))
            else resolve(isMatch)
        })
    });
}

module.exports = {comparePassword}