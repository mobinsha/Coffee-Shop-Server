const productModel = require("../models/productModel");
const { sendResponse } = require('../utils/responseHandler');

async function getAllProduct(req, res, next) {
    try {
        const product = await productModel.getAllProduct();
        sendResponse(res, 200, 'Success', product);
    } catch (err) {
        next(err);
    }
}

async function getProductById(req, res, next) {
    const productId = req.params.id;

    try {
        const product = await productModel.getProductById(productId);
        sendResponse(res, 200, 'Success', product);
    } catch (err) {
        next(err);
    }
}

async function addProduct(req, res, next) {
    const { imageAddress, name, shortTitle, price, description } = req.body;
    try {
        const newProduct = await productModel.addProduct({
            imageAddress,
            name,
            shortTitle,
            price,
            description
        });
        sendResponse(res, 201, 'Product successfully added', newProduct);
    } catch (err) {
        next(err);
    }
}

async function deleteProduct(req, res, next) {
    const deleteProductId = req.params.id;
    try {
        await productModel.deleteProduct(deleteProductId);
        sendResponse(res, 200, 'Product successfully deleted');
    } catch (err) {
        if (err.message === 'Product not found.') {
            sendResponse(res, 404, err.message);
        } else {
            next(err);
        }
    }
}

async function updateProduct(req, res, next) {
    const productId = req.params.id;
    const productData = req.body;

    try {
        await productModel.updateProduct(productId, productData);
        sendResponse(res, 200, 'Product successfully updated');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllProduct,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
};
