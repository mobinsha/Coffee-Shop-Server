const servicesModel = require("../models/servicesModel");
const { validationResult } = require("express-validator");
const { sendResponse } = require('../utils/responseController');

async function getAllServices(req, res, next) {
    try {
        const service = await servicesModel.getAllServices();
        sendResponse(res, 200, 'Success', service);
    } catch (err) {
        next(err);
    }
}

async function getServicesById(req, res, next) {
    const servicesId = req.params.id;

    try {
        const service = await servicesModel.getServicesById(servicesId);
        sendResponse(res, 200, 'Success', service);
    } catch (err) {
        next(err);
    }
}

async function addService(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 400, 'Validation errors', {}, errors.array());
    }

    const { imageAddress, name } = req.body;

    try {
        const newService = await servicesModel.addService({ imageAddress, name });
        sendResponse(res, 201, 'Service successfully added', newService);
    } catch (err) {
        next(err);
    }
}

async function deleteService(req, res, next) {
    const deleteServiceId = req.body.id;
    try {
        await servicesModel.deleteService(deleteServiceId);
        sendResponse(res, 200, 'Service successfully deleted');
    } catch (err) {
        next(err);
    }
}

async function updateService(req, res, next) {
    const serviceId = req.body.id;
    const serviceData = req.body;

    try {
        await servicesModel.updateService(serviceId, serviceData);
        sendResponse(res, 200, 'Service successfully updated');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllServices,
    getServicesById,
    addService,
    deleteService,
    updateService
};
