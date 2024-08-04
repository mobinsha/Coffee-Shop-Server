const userModel = require("../models/userModel");
const { validationResult } = require('express-validator');


function sendResponse(res, statusCode, message, data = {}, error = null) {
    res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
        error
    });
}


async function getAllUsers(req, res) {
    try {
        const users = await userModel.getAllUsers();
        sendResponse(res, 200, 'موفقیت‌آمیز', users);
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const user = await userModel.getUserById(userId);
        sendResponse(res, 200, 'موفقیت‌آمیز', user);

    } catch (err) {
        if (err.message === 'کاربر یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function deleteUser(req, res) {
    const deleteUserId = req.body.id;
    try {
        await userModel.deleteUser(deleteUserId);
        sendResponse(res, 200, 'کاربر با موفقیت حذف شد');
    } catch (err) {
        if (err.message === 'کاربر یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function addUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const { userName, password, email, fullName, phoneNumber, permission } = req.body;
    try {
        await userModel.addUser({ userName, password, email, fullName, phoneNumber, permission });
        sendResponse(res, 201, 'کاربر با موفقیت اضافه شد');
    } catch (error) {
        sendResponse(res, 500, 'خطای سرور', error.message);
    }
}


async function userUpdate(req, res) {
    const userId = req.body.id;
    const userData = req.body;

    try {
        await userModel.userUpdate(userId, userData);
        sendResponse(res, 200, 'کاربر با موفقیت به‌روزرسانی شد');

    } catch (error) {
        if (error.message === 'کاربر یافت نشد.') {
            sendResponse(res, 404, error.message);
        } else if (error.message === 'اطلاعات جدید وارد کنید') {
            sendResponse(res, 400, error.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, error.message);
        }
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    userUpdate
};
