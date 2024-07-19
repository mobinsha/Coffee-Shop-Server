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
        'SELECT * FROM `users` WHERE `id` = ?',
        [id],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result[0]);
        }
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


function userUpdate (userID ,userData ,callback){
    getUserById(userID, (err, currentUser) => {
        if (err) return callback(err, null);
        if (!currentUser) return callback(new Error('User not found'), null);

        const updatedUser = {
            userName: userData.userName || currentUser.userName,
            fullName: userData.fullName || currentUser.fullName,
            email: userData.email || currentUser.email,
            phoneNumber: userData.phoneNumber || currentUser.phoneNumber,
            gender: userData.gender || currentUser.gender,
            permission: userData.permission || currentUser.permission
        }

        dbConnection.query(
            'UPDATE `users` ' +
            'SET `userName` = ?,' +
            ' `fullName` = ?,' +
            ' `email` = ?,' +
            ' `phoneNumber` = ?,' +
            ' `gender` = ?,' +
            ' `permission` = ?' +
            ' WHERE `id` = ?',
            [updatedUser.userName, updatedUser.fullName, updatedUser.email,
                updatedUser.phoneNumber, updatedUser.gender, updatedUser.permission, userID],
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        )
    });
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    userUpdate
}
