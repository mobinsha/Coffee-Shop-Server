const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/sendError');

async function getRecommended() {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM `product` ORDER BY RAND() LIMIT 5', (err, result) => {
            if (err) return reject(new SendError(500, err));
            else resolve(result);
        });
    });
}

module.exports = {getRecommended}

