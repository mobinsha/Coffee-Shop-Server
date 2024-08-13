const userModel = require("../models/userModel");
const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/responseController');
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function getAllUsers(req, res, next) {
    try {
        const users = await userModel.getAllUsers();
        sendResponse(res, 200, 'Success', users);
    } catch (err) {
        next(err);
    }
}

async function getUserById(req, res, next) {
    const userId = req.params.id;
    try {
        const user = await userModel.getUserById(userId);
        sendResponse(res, 200, 'Success', user);
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    const {userNameOrEmail, password} = req.body
    try {
        const user = await userModel.getUserByUsernameOrEmail(userNameOrEmail)
        const isMatch = await userModel.comparePassword(password, user.password)

        if (isMatch){
            const token = jwt.sign({id : user.id, permission : user.permission}, process.env.JWT_SECRET, {algorithm : 'HS256', expiresIn: '1h'})
            sendResponse(res, 200, 'Success', {token : token});
        }

    } catch (err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    const deleteUserId = req.body.id;
    try {
        await userModel.deleteUser(deleteUserId);
        sendResponse(res, 200, 'User successfully deleted');
    } catch (err) {
        next(err);
    }
}

async function register(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'Validation errors', {}, errors.array());
    }

    const { userName, password, email, fullName, phoneNumber, permission } = req.body;
    try {
        await userModel.addUser({ userName, password, email, fullName, phoneNumber, permission });
        sendResponse(res, 201, 'User successfully added');
    } catch (err) {
        next(err);
    }
}

async function userUpdate(req, res, next) {
    const userId = req.body.id;
    const userData = req.body;

    try {
        await userModel.userUpdate(userId, userData);
        sendResponse(res, 200, 'User successfully updated');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    register,
    login,
    deleteUser,
    userUpdate
};
