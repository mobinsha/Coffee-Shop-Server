const { dbConnection } = require('../config/dbConnection');
const { SendError } = require('../utils/sendError');
const bcrypt = require('bcryptjs')


async function getAllUsers() {    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM `users` ORDER BY createdAt DESC', (err, result) => {
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
                if (result.length === 0) return reject(new SendError(404, 'کاربر مورد نظر یافت نشد'));
                else resolve(result);
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
                if (result.affectedRows === 0) return reject(new SendError(404, 'کاربر مورد نظر یافت نشد'));
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
                if (result.length === 0) return reject(new SendError(404, 'نام کاربری یا ایمیل یافت نشد'));
                if (result[0].accountStatus === 'inactive') return reject(new SendError(403, 'حساب کاربری شما غیرفعال است. لطفاً با پشتیبانی تماس بگیرید'))
                if (result[0].accountStatus === 'banned') return reject(new SendError(403, 'حساب کاربری شما مسدود شده است. لطفاً با پشتیبانی تماس بگیرید'))
                else resolve(result[0])
            }
        );
    });
}

async function addUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 11)
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'INSERT INTO `users` (`id`, `userName`, `password`, `email`, `fullName`, `phoneNumber`, `permission`, `accountStatus`, `createdAt`, `updatedAt`) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp())',
            [userData.userName, hashedPassword, userData.email, userData.fullName, userData.phoneNumber, userData.permission, 'active'],
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
        throw new SendError(404, 'کاربر مورد نظر یافت نشد');
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

    if (userData.password) {
        userUpdate.password = await bcrypt.hash(userData.password, 11);
    } else {
        userUpdate.password = currentData.password;
    }

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `users` SET `userName` = ?, `password` = ?, `email` = ?, `fullName` = ?, `phoneNumber` = ?, `permission` = ? WHERE `id` = ?',
            [userUpdate.userName, userUpdate.password, userUpdate.email, userUpdate.fullName, userUpdate.phoneNumber, userUpdate.permission, userID],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.changedRows === 0) return reject(new SendError(400, 'لطفاً اطلاعات جدید وارد کنید'));
                else resolve(result);
            });
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    checkUserNameExists,
    checkEmailExists,
    deleteUser,
    getUserByUsernameOrEmail,
    addUser,
    userUpdate
};
