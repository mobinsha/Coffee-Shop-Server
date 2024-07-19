const {dbConnection} = require('../config/dbConnection')
const {result} = require("lodash/object");


function getAllUsers(callback) {
    dbConnection.query(
        'SELECT * FROM `users`' ,
        callback
    )
}


function getUserById (id , callback){
    dbConnection.query(
        'SELECT * FROM `users` WHERE id = ? ',
        [id],
        callback
    )
}


function deleteUser (id , callback){
    dbConnection.query(
        'DELETE FROM users WHERE `users`.`id` = ?',
        [id],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    )
}


function addUser(userData, callback){
    dbConnection.query(
        'INSERT INTO `users` (`id`, `userName`, `fullName`, `email`, `phoneNumber`, `gender`, `permission`, `createdAt`) ' +
        'VALUES (NULL, ?, ?, ?, ?, ?, ?, current_timestamp())',
        [userData.userName, userData.fullName, userData.email, userData.phoneNumber, userData.gender, userData.permission],
        (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, { id: results.insertId, ...userData });
        }
    );
}


// function userUpdate (userID ,userData ,callback){
//     dbConnection.query(
//         'UPDATE users SET ? WHERE id = ?',
//         [userData, userID],
//         (err, result) => {
//             if (err) {
//                 return callback(err, null);
//             }
//             callback(null, result.affectedRows);
//         }
//     )
// }

function updateUser(userId, userData, callback) {
    // ساختن کوئری دینامیک
    let fields = [];
    let values = [];
    for (const [key, value] of Object.entries(userData)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(userId); // اضافه کردن userId به لیست مقادیر

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    dbConnection.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            callback(err, null);
            return;
        }
        callback(null, result.affectedRows); // تعداد ردیف‌های تحت تأثیر برگشت داده می‌شود
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
}
