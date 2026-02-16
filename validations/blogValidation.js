const { body } = require('express-validator');

// Regex for image extensions
const imagePattern = /\.(jpeg|jpg|gif|png|webp|svg)$/i;

const validateAddBlog = [
    body('title')
        .notEmpty()
        .withMessage('عنوان مقاله الزامی است').bail()
        .isLength({ min: 5, max: 225 })
        .withMessage('عنوان باید بین 5 تا 225 کاراکتر باشد'),

    body('content')
        .notEmpty()
        .withMessage('محتوای مقاله الزامی است').bail()
        .isLength({ min: 50 })
        .withMessage('محتوای مقاله باید حداقل 50 کاراکتر باشد'),

    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value)) {
                throw new Error('آدرس تصویر باید یک فایل تصویری معتبر باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        })
];

const validateUpdateBlog = [
    body('title')
        .optional()
        .isLength({ min: 5, max: 225 })
        .withMessage('عنوان باید بین 5 تا 225 کاراکتر باشد'),

    body('content')
        .optional()
        .isLength({ min: 50 })
        .withMessage('محتوای مقاله باید حداقل 50 کاراکتر باشد'),

    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value)) {
                throw new Error('آدرس تصویر باید یک فایل تصویری معتبر باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        }),

    body('adminId')
        .optional()
        .isNumeric()
        .withMessage('شناسه کاربر باید یک عدد باشد')
];

module.exports = {
    validateAddBlog,
    validateUpdateBlog
};
