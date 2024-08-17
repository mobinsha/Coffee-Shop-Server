const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/SendError');

async function getAllProduct() {
    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM `product`', (err, result) => {
            if (err) return reject(new SendError(500, err));
            else resolve(result);
        });
    });
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'SELECT * FROM `product` WHERE `id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.length === 0) return reject(new SendError(404, 'Product not found.'));
                else resolve(result);
            }
        );
    });
}

async function addProduct(ProductData) {
    return new Promise((resolve, reject) => {
        dbConnection.query('INSERT INTO `product`(`id`, `imageAddress`,`name`,' +
            '`shortTitle`, `price`, `description`)' +
            ' VALUES (NULL,?, ?, ?, ?, ?)',

            [ProductData.imageAddress,
                ProductData.name,
                ProductData.shortTitle,
                ProductData.price,
                ProductData.description],

            (err, results) => {
                if (err) return reject(new SendError(500, err));
                else resolve({ id: results.insertId, ...ProductData });
            }
        );
    });
}

async function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        dbConnection.query(
            'DELETE FROM product WHERE `product`.`id` = ?',
            [id],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.affectedRows === 0) return reject(new SendError(404, 'Product not found.'));
                else resolve(result);
            }
        );
    });
}

async function updateProduct(productId, productData) {
    const currentDataArray = await getProductById(productId);
    if (currentDataArray.length === 0) {
        throw new SendError(404, 'Service not found.');
    }
    const currentData = currentDataArray[0];

    const productUpdate = {
        imageAddress: productData.imageAddress || currentData.imageAddress,
        name: productData.name || currentData.name,
        shortTitle: productData.shortTitle || currentData.shortTitle,
        price: productData.price || currentData.price,
        description: productData.description || currentData.description,
    };

    return new Promise((resolve, reject) => {
        dbConnection.query('UPDATE `product` SET ' +
            '`imageAddress` = ?,' +
            ' `name` = ?,' +
            ' `shortTitle` = ?,' +
            ' `price` = ?,' +
            ' `description` = ?' +
            ' WHERE `product`.`id` = ?',
            [productUpdate.imageAddress, productUpdate.name, productUpdate.shortTitle,
                productUpdate.price, productUpdate.description, productId],
            (err, result) => {
                if (err) return reject(new SendError(500, err));
                if (result.changedRows === 0) return reject(new SendError(400, 'Enter new information.'));
                else resolve(result);
            });
    });
}

module.exports = {
    getAllProduct,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
};
