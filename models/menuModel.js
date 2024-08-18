const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/SendError');

async function getMenu() {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT id, name, price FROM `product` ORDER BY RAND() LIMIT 8', (err, result) => {
            if (err) return reject(new SendError(500, err));
            else resolve(result);
        });
    });
}

module.exports = {getMenu}