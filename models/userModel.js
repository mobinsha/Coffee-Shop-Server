const {dbConnection} = require('../config/dbConnection')


async function getAllUsers() {
    return new Promise((resolve,reject) => {
        dbConnection.query('SELECT * FROM `users`', (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function getUserById (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `users` WHERE `id` = ?',
            [id],
            (err, result)=> {
                if (err) return reject(err);
                if (result.length === 0) return reject(new Error('کاربر یافت نشد.'));
                resolve(result);
            })
    })
}


async function checkUserNameExists(userName) {
    return await new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM users WHERE userName = ?', [userName], (err, rows) => {
            if (err) reject(err)
            else resolve(rows.length > 0);
        });
    });
}


async function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM users WHERE `email` = ?', [email], (err, rows) => {
            if (err) return reject(err)
            else resolve(rows.length > 0)
        })
    });
}


async function deleteUser (id){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM users WHERE `users`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('کاربر یافت نشد.'));
                else resolve(result);
            }
        )
    })
}


async function addUser(userData){
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'INSERT INTO `users` (`id`, `userName`,' +
            ' `password`, `email`,' +
            ' `fullName`, `phoneNumber`,' +
            ' `permission`, `accountStatus`,' +
            ' `createdAt`, `updatedAt`) ' +
            'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp())',
            [userData.userName, userData.password, userData.email,
                userData.fullName, userData.phoneNumber, 'guest', 'active'],
            (err, result) => {
                if (err)return reject(err)
                else resolve({ id: result.insertId, ...userData })
            }
        );
    })
}


async function userUpdate (userID ,userData){

    const currentDataArray  = await getUserById(userID)
    if (currentDataArray.length === 0) {
        throw new Error('کاربر یافت نشد.');
    }
    const currentData = currentDataArray[0]

    const userUpdate = {
        userName: userData.userName || currentData.userName,
        password: userData.password || currentData.password,
        email: userData.email || currentData.email,
        fullName : userData.fullName || currentData.fullName,
        phoneNumber: userData.phoneNumber || currentData.phoneNumber,
        permission: userData.permission || currentData.permission
    }

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `users` ' +
            'SET `userName` = ?,' +
            ' `password` = ?,' +
            ' `email` = ?,' +
            ' `fullName` = ?,' +
            ' `phoneNumber` = ?,' +
            ' `permission` = ?' +
            ' WHERE `id` = ?',
            [userUpdate.userName, userUpdate.password, userUpdate.email,
                userUpdate.fullName, userUpdate.phoneNumber, userUpdate.permission, userID],
            (err, result) => {
                if (err) return reject(err)
                if (result.changedRows === 0) return reject(new Error('اطلاعات جدید وارد کنید'));
                else resolve(result)
            })
    })
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    userUpdate,
    checkUserNameExists,
    checkEmailExists
}
