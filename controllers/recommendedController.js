const recommendedModel = require("../models/recommendedModel")
const {validationResult} = require("express-validator");
const servicesModel = require("../models/servicesModel");


function sendResponse(res, statusCode, message, data = {}, error = null) {
    res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
        error
    });
}


async function getAllRecommended (req, res) {
    try{
        const recommended = await recommendedModel.getAllRecommended()
        sendResponse(res, 200, 'موفقیت‌آمیز', recommended);
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function getRecommendedById (req, res) {
    const recommendedId = req.params.id

    try{
        const recommended = await recommendedModel.getRecommendedById(recommendedId)
        sendResponse(res, 200, 'موفقیت‌آمیز', recommended);
    } catch (err) {
        if (err === 'محصول مورد نظر یافت نشد.'){
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function addRecommended (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const {imageAddress, name, shortTitle, price, description} = req.body;
    try {
        const newRecommended = await recommendedModel.addRecommended({imageAddress, name, shortTitle, price, description})
        sendResponse(res, 201, newRecommended,'محصول با موفقیت اضافه شد');
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function deleteRecommended(req, res) {
    const deleteRecommendedId = req.body.id;
    try {
        await recommendedModel.deleteRecommended(deleteRecommendedId);
        sendResponse(res, 200, 'محصول با موفقیت حذف شد');
    } catch (err) {
        if (err.message === 'محصول یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function updateRecommended(req, res) {
    const recommendedId = req.body.id;
    const recommendedData = req.body;

    try {
        await recommendedModel.updateRecommended(recommendedId, recommendedData);
        sendResponse(res, 200, 'محصول با موفقیت به‌روزرسانی شد');

    } catch (error) {
        if (error.message === 'محصول یافت نشد.') {
            sendResponse(res, 404, error.message);
        } else if (error.message === 'اطلاعات جدید وارد کنید') {
            sendResponse(res, 400, error.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, error.message);
        }
    }
}


module.exports = {
    getAllRecommended,
    getRecommendedById,
    addRecommended,
    deleteRecommended,
    updateRecommended
}