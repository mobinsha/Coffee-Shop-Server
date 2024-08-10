const recommendedModel = require("../models/recommendedModel")
const {validationResult} = require("express-validator");
const {sendResponse} = require('../untils/responseController')


async function getAllRecommended(req, res, next) {
    try {
        const recommended = await recommendedModel.getAllRecommended()
        sendResponse(res, 200, 'موفقیت‌آمیز', recommended);
    } catch (err) {
        next(err)
    }
}


async function getRecommendedById(req, res, next) {
    const recommendedId = req.params.id

    try {
        const recommended = await recommendedModel.getRecommendedById(recommendedId)
        sendResponse(res, 200, 'موفقیت‌آمیز', recommended);
    } catch (err) {
        next(err)
    }
}


async function addRecommended(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const {imageAddress, name, shortTitle, price, description} = req.body;
    try {
        const newRecommended = await recommendedModel.addRecommended({
            imageAddress,
            name,
            shortTitle,
            price,
            description
        })
        sendResponse(res, 201, newRecommended, 'محصول با موفقیت اضافه شد');
    } catch (err) {
        next(err)
    }
}


async function deleteRecommended(req, res, next) {
    const deleteRecommendedId = req.body.id;
    try {
        await recommendedModel.deleteRecommended(deleteRecommendedId);
        sendResponse(res, 200, 'محصول با موفقیت حذف شد');
    } catch (err) {
        if (err.message === 'محصول یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            next(err)
        }
    }
}


async function updateRecommended(req, res, next) {
    const recommendedId = req.body.id;
    const recommendedData = req.body;

    try {
        await recommendedModel.updateRecommended(recommendedId, recommendedData);
        sendResponse(res, 200, 'محصول با موفقیت به‌روزرسانی شد');

    } catch (err) {
        next(err)
    }
}


module.exports = {
    getAllRecommended,
    getRecommendedById,
    addRecommended,
    deleteRecommended,
    updateRecommended
}