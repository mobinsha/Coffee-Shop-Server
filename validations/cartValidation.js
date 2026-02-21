const { body } = require('express-validator');

const validateAddToCart = [
    body('productId')
        .notEmpty()
        .withMessage('شناسه محصول الزامی است')
        .isInt({ min: 1 })
        .withMessage('شناسه محصول باید یک عدد مثبت باشد'),

    body('quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('تعداد باید حداقل 1 باشد')
];

const validateUpdateCartItem = [
    body('quantity')
        .notEmpty()
        .withMessage('تعداد الزامی است')
        .isInt({ min: 0 })
        .withMessage('تعداد باید 0 یا بیشتر باشد')
];

const validateSyncCart = [
    body('items')
        .isArray()
        .withMessage('آیتم‌ها باید به صورت آرایه باشند'),

    body('items.*.productId')
        .notEmpty()
        .withMessage('هر آیتم باید شناسه محصول داشته باشد')
        .isInt({ min: 1 })
        .withMessage('شناسه محصول باید یک عدد مثبت باشد'),

    body('items.*.quantity')
        .notEmpty()
        .withMessage('هر آیتم باید تعداد داشته باشد')
        .isInt({ min: 0 })
        .withMessage('تعداد باید 0 یا بیشتر باشد')
];

module.exports = {
    validateAddToCart,
    validateUpdateCartItem,
    validateSyncCart
};
