const servicesModel = require("../models/servicesModel")
const {validationResult} = require("express-validator");
const userModel = require("../models/userModel");

function sendResponse(res, statusCode, message, data = {}, error = null) {
    res.status(statusCode).json({
        status: statusCode < 400,
        message,
        data,
        error
    });
}


async function getAllServices (req, res) {
    try{
        const service = await servicesModel.getAllServices()
        sendResponse(res, 200, 'موفقیت‌آمیز', service);
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function getServicesById (req, res) {
    const servicesId = req.params.id

    try{
        const service = await servicesModel.getServicesById(servicesId)
        sendResponse(res, 200, 'موفقیت‌آمیز', service);
    } catch (err) {
        if (err === 'سروریس مورد نظر یافت نشد.'){
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


async function addService (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'خطاهای اعتبارسنجی', {}, errors.array());
    }

    const {imageAddress , name} = req.body;

    try {
        const newService = await servicesModel.addService({imageAddress , name})
        sendResponse(res, 201, 'سرویس با موفقیت اضافه شد');
    } catch (err) {
        sendResponse(res, 500, 'خطای سرور', err.message);
    }
}


async function deleteService(req, res) {
    const deleteServiceId = req.body.id;
    try {
        await servicesModel.deleteService(deleteServiceId);
        sendResponse(res, 200, 'سرویس با موفقیت حذف شد');
    } catch (err) {
        if (err.message === 'سرویس یافت نشد.') {
            sendResponse(res, 404, err.message);
        } else {
            sendResponse(res, 500, 'خطای سرور', {}, err.message);
        }
    }
}


module.exports = {
    getAllServices,
    getServicesById,
    deleteService,
    addService
}