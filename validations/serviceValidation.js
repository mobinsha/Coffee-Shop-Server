const { body } = require('express-validator');

// Regex pattern for Persian/English letters, numbers and spaces
const namePattern = /^[\u0600-\u06FFa-zA-Z0-9\s]+$/;
// Regex for image extensions
const imagePattern = /\.(jpeg|jpg|gif|png|webp|svg)$/i;

const validateAddService = [
    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value)) {
                throw new Error('آدرس تصویر باید یک فایل تصویری معتبر باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        }),

    body('name')
        .notEmpty()
        .withMessage('نام خدمات الزامی است').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام خدمات باید بین 2 تا 100 کاراکتر باشد').bail()
        .custom((value) => {
            if (!namePattern.test(value)) {
                throw new Error('نام خدمات فقط می‌تواند شامل حروف فارسی یا انگلیسی، اعداد و فاصله باشد');
            }
            return true;
        }),

    body('description')
        .optional()
        .isString()
        .withMessage('توضیحات باید متن باشد').bail()
        .isLength({ max: 500 })
        .withMessage('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد')
];

const validateUpdateService = [
    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value)) {
                throw new Error('آدرس تصویر باید یک فایل تصویری معتبر باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        }),

    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام خدمات باید بین 2 تا 100 کاراکتر باشد').bail()
        .custom((value) => {
            if (!namePattern.test(value)) {
                throw new Error('نام خدمات فقط می‌تواند شامل حروف فارسی یا انگلیسی، اعداد و فاصله باشد');
            }
            return true;
        }),

    body('description')
        .optional()
        .isString()
        .withMessage('توضیحات باید متن باشد').bail()
        .isLength({ max: 500 })
        .withMessage('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد')
];

module.exports = {
    validateAddService,
    validateUpdateService
};
