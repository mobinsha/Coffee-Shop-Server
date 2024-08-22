const { body } = require('express-validator');

validateAddProduct = [
    body('imageAddress')
        .matches(/\.(jpeg|jpg|gif|png)$/)
        .withMessage('The address must be an image in jpg, jpeg, gif, or png format.'),

    body('name')
        .notEmpty()
        .withMessage('Name is required.').bail()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters long.').bail()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('Name can only contain letters, numbers, and spaces.'),

    body('shortTitle')
        .notEmpty()
        .withMessage('Product name is required.').bail()
        .isString()
        .withMessage('Title must be a string.').bail()
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long.').bail()
        .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters.'),

    body('price')
        .notEmpty()
        .withMessage('Product price is required.').bail()
        .isNumeric().withMessage('Price must be a number.').bail()
        .isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),

    body('description')
        .isString().withMessage('Description must be a string.').bail()
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long.')
];

validateUpdateProduct = [
    body('imageAddress')
        .optional()
        .matches(/\.(jpeg|jpg|gif|png)$/)
        .withMessage('The address must be an image in jpg, jpeg, gif, or png format.'),

    body('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters long.').bail()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('Name can only contain letters, numbers, and spaces.'),

    body('shortTitle')
        .optional()
        .isString()
        .withMessage('Title must be a string.').bail()
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long.').bail()
        .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters.'),

    body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number.').bail()
        .isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.').bail()
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long.')
]




module.exports = {
    validateAddProduct,
    validateUpdateProduct
}