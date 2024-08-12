const { dbConnection } = require('../config/dbConnection');
const { SendError } = require('../utils/sendError');
const bcrypt = require('bcrypt')

async function getAllUsers() {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM `users`', (err, result) => {
            if (err) return reject(new SendError(500, err));
            else resolve(result);
        });
    });
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `users` WHERE `id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.length === 0) return reject(new SendError(404, 'User not found.'));
                else resolve(result);
            }
        );
    });
}

async function checkUserExist(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT id FROM `users` WHERE `id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                else resolve(result.length > 0);
            }
        );
    });
}

async function checkUserNameExists(userName) {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM users WHERE userName = ?', [userName], (err, rows) => {
            if (err) return reject(new SendError(500, err));
            else resolve(rows.length > 0);
        });
    });
}

async function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM users WHERE `email` = ?', [email], (err, rows) => {
            if (err) return reject(new SendError(500, err));
            else resolve(rows.length > 0);
        });
    });
}

async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM users WHERE `users`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.affectedRows === 0) return reject(new SendError(404, 'User not found.'));
                else resolve(result);
            }
        );
    });
}

function  getUserByUsernameOrEmail(userNameOrEmail) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `users` WHERE userName = ? OR email = ?;',
            [userNameOrEmail, userNameOrEmail],
            async (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.length === 0) return reject(new SendError(404, 'UserName or Email not found.'));
                else resolve(result[0])
            }
        );
    });
}

async function comparePassword(inputPassword, userPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, userPassword, (err, isMatch) => {
            if (err) return reject(new SendError(500, err))
            if (!isMatch) return reject(new SendError(401, 'Incorrect password.'))
            else resolve(isMatch)
        })
    });
}

async function addUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 11)
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'INSERT INTO `users` (`id`, `userName`, `password`, `email`, `fullName`, `phoneNumber`, `permission`, `accountStatus`, `createdAt`, `updatedAt`) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp())',
            [userData.userName, hashedPassword, userData.email, userData.fullName, userData.phoneNumber, 'guest', 'active'],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                else resolve({ id: result.insertId, ...userData });
            }
        );
    });
}

async function userUpdate(userID, userData) {
    const currentDataArray = await getUserById(userID);
    if (currentDataArray.length === 0) {
        throw new SendError(404, 'User not found.');
    }
    const currentData = currentDataArray[0];

    const userUpdate = {
        userName: userData.userName || currentData.userName,
        password: userData.password || currentData.password,
        email: userData.email || currentData.email,
        fullName: userData.fullName || currentData.fullName,
        phoneNumber: userData.phoneNumber || currentData.phoneNumber,
        permission: userData.permission || currentData.permission
    };

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `users` SET `userName` = ?, `password` = ?, `email` = ?, `fullName` = ?, `phoneNumber` = ?, `permission` = ? WHERE `id` = ?',
            [userUpdate.userName, userUpdate.password, userUpdate.email, userUpdate.fullName, userUpdate.phoneNumber, userUpdate.permission, userID],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.changedRows === 0) return reject(new SendError(400, 'Enter new information'));
                else resolve(result);
            });
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    checkUserExist,
    checkUserNameExists,
    checkEmailExists,
    deleteUser,
    getUserByUsernameOrEmail,
    comparePassword,
    addUser,
    userUpdate
};
