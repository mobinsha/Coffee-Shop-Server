const menuModel = require("../models/menuModel");
const { sendResponse } = require('../utils/responseHandler');

async function getMenu(req, res, next) {
    try {
        const menu = await menuModel.getMenu();
        sendResponse(res, 200, 'Success', menu);
    } catch (err) {
        next(err);
    }
}

module.exports = {getMenu}
