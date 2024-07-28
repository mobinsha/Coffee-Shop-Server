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
        'INSERT INTO `users` (`id`, `userName`,' +
        ' `password`, `email`,' +
        ' `fullName`, `phoneNumber`,' +
        ' `permission`, `accountStatus`,' +
        ' `createdAt`, `updatedAt`) ' +
        'VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp())',
        [userData.userName, userData.password, userData.email, userData.fullName, userData.phoneNumber, 'guest', 'active'],
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
            password: userData.password || currentUser.password,
            email: userData.email || currentUser.email,
            fullName : userData.fullName || currentUser.fullName,
            phoneNumber: userData.phoneNumber || currentUser.phoneNumber,
            permission: userData.permission || currentUser.permission
        }

        dbConnection.query(
            'UPDATE `users` ' +
            'SET `userName` = ?,' +
            ' `password` = ?,' +
            ' `email` = ?,' +
            ' `fullName` = ?,' +
            ' `phoneNumber` = ?,' +
            ' `permission` = ?' +
            ' WHERE `id` = ?',
            [updatedUser.userName, updatedUser.password, updatedUser.email,
                updatedUser.fullName, updatedUser.phoneNumber, updatedUser.permission, userID],
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
