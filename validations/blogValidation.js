const { body } = require('express-validator');
const {login} = require("../controllers/userController");

validateAddBlog = [
    body('title')
        .notEmpty()
        .withMessage('Title is required.').bail()
        .isLength({ max: 225 }).withMessage('Title must be at most 225 characters long.').bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Title must contain only English letters and spaces.'),
    body('content')
        .notEmpty()
        .withMessage('Content is required.').bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Content must contain only English letters and spaces.')
];

validateUpdateBlog = [
    body('title')
        .optional()
        .isLength({ max: 225 }).withMessage('Title must be at most 225 characters long.').bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Title must contain only English letters and spaces.'),
    body('content')
        .optional()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Content must contain only English letters and spaces.'),
    body('adminId')
        .optional()
        .isNumeric().withMessage('User ID must be a numeric value.')
]

module.exports = {
    validateAddBlog,
    validateUpdateBlog
}