const { body } = require('express-validator');

validateAddService = [
    body('imageAddress')
        .notEmpty().withMessage('Image address is required.').bail()
        .matches(/\.(jpeg|jpg|gif|png)$/)
        .withMessage('The address must be an image in jpg, jpeg, gif, or png format.'),

    body('name')
        .notEmpty()
        .withMessage('Service name is required.').bail()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters long.').bail()
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage('Name can only contain letters, numbers, and spaces.'),
];

validateUpdateService = [
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
]

module.exports = {
    validateAddService,

}