const { body } = require('express-validator');

// Regex pattern for Persian/English letters, numbers and spaces
const namePattern = /^[\u0600-\u06FFa-zA-Z0-9\s]+$/;
// Regex for URL or local path
const urlPattern = /^(https?:\/\/.+|\/.+)$/;
// Regex for image extensions
const imagePattern = /\.(jpeg|jpg|gif|png|webp|svg)$/i;

const validateAddProduct = [
    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value) && !urlPattern.test(value)) {
                throw new Error('آدرس تصویر باید یک URL معتبر یا مسیر فایل تصویری باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        }),

    body('name')
        .notEmpty()
        .withMessage('نام محصول الزامی است').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام محصول باید بین 2 تا 100 کاراکتر باشد').bail()
        .custom((value) => {
            if (!namePattern.test(value)) {
                throw new Error('نام محصول فقط می‌تواند شامل حروف فارسی یا انگلیسی، اعداد و فاصله باشد');
            }
            return true;
        }),

    body('shortTitle')
        .optional()
        .isString()
        .withMessage('عنوان کوتاه باید متن باشد').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('عنوان کوتاه باید بین 2 تا 100 کاراکتر باشد'),

    body('price')
        .notEmpty()
        .withMessage('قیمت محصول الزامی است').bail()
        .isNumeric()
        .withMessage('قیمت باید یک عدد باشد').bail()
        .isFloat({ gt: 0 })
        .withMessage('قیمت باید بزرگتر از صفر باشد'),

    body('description')
        .optional()
        .isString()
        .withMessage('توضیحات باید متن باشد').bail()
        .isLength({ min: 5, max: 500 })
        .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد')
];

const validateUpdateProduct = [
    body('imageAddress')
        .optional()
        .custom((value) => {
            if (!value) return true;
            if (!imagePattern.test(value) && !urlPattern.test(value)) {
                throw new Error('آدرس تصویر باید یک URL معتبر یا مسیر فایل تصویری باشد (jpg, jpeg, png, gif, webp)');
            }
            return true;
        }),

    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('نام محصول باید بین 2 تا 100 کاراکتر باشد').bail()
        .custom((value) => {
            if (!namePattern.test(value)) {
                throw new Error('نام محصول فقط می‌تواند شامل حروف فارسی یا انگلیسی، اعداد و فاصله باشد');
            }
            return true;
        }),

    body('shortTitle')
        .optional()
        .isString()
        .withMessage('عنوان کوتاه باید متن باشد').bail()
        .isLength({ min: 2, max: 100 })
        .withMessage('عنوان کوتاه باید بین 2 تا 100 کاراکتر باشد'),

    body('price')
        .optional()
        .isNumeric()
        .withMessage('قیمت باید یک عدد باشد').bail()
        .isFloat({ gt: 0 })
        .withMessage('قیمت باید بزرگتر از صفر باشد'),

    body('description')
        .optional()
        .isString()
        .withMessage('توضیحات باید متن باشد').bail()
        .isLength({ min: 5, max: 500 })
        .withMessage('توضیحات باید بین 5 تا 500 کاراکتر باشد')
];

module.exports = {
    validateAddProduct,
    validateUpdateProduct
};
