const recommendedModel = require("../models/recommendedModel");
const { sendResponse } = require('../utils/responseHandler');

async function getRecommended(req, res, next) {
    try {
        const product = await recommendedModel.getRecommended();
        sendResponse(res, 200, 'Success', product);
    } catch (err) {
        next(err);
    }
}

module.exports = {getRecommended}
