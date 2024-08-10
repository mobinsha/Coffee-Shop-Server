const userModel = require("../models/userModel");
const {validationResult} = require('express-validator');
const {sendResponse} = require('../untils/responseController')


async function getAllUsers(req, res, next) {
    try {
        const users = await userModel.getAllUsers();
        sendResponse(res, 200, 'موفقیت‌آمیز', users);
    } catch (err) {
        next(err)
    }
}


async function getUserById(req, res, next) {
    const userId = req.params.id;
    try {
        const user = await userModel.getUserById(userId);
        sendResponse(res, 200, 'موفقیت‌آمیز', user);
    } catch (err) {
        next(err)
    }
}


async function deleteUser(req, res, next) {
    const deleteUserId = req.body.id;
    try {
        await userModel.deleteUser(deleteUserId);
        sendResponse(res, 200, 'کاربر با موفقیت حذف شد');
    } catch (err) {
        next(err)
    }
}


async function addUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const {userName, password, email, fullName, phoneNumber, permission} = req.body;
    try {
        await userModel.addUser({userName, password, email, fullName, phoneNumber, permission});
        sendResponse(res, 201, 'کاربر با موفقیت اضافه شد');
    } catch (err) {
        next(err)
    }
}


async function userUpdate(req, res, next) {
    const userId = req.body.id;
    const userData = req.body;

    try {
        await userModel.userUpdate(userId, userData);
        sendResponse(res, 200, 'کاربر با موفقیت به‌روزرسانی شد');

    } catch (err) {
        next(err)
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    userUpdate
};
