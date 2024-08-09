const { body } = require ('express-validator')


exports.validateAddBlog = [
    body('title')
        .notEmpty()
        .withMessage('نام سرویس الزامی است.').bail()
        .isLength({ max: 225 }).withMessage('Title must be at most 225 characters long.').bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Title must contain only English letters and spaces.'),
    body('content')
        .notEmpty()
        .withMessage('نام سرویس الزامی است.').bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage('Content must contain only English letters and spaces.'),
    body('userId')
        .isNumeric().withMessage('User ID must be a numeric value.')
]