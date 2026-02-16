const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { validateAddToCart, validateUpdateCartItem, validateSyncCart } = require('../validations/cartValidation');
const { validationResults } = require('../middlewares/validationResults');

/**
 * Cart Routes
 * All routes require authentication
 * Base path: /api/cart
 */

// Apply authentication middleware to all cart routes
router.use(authenticateToken);

// Get user's cart with all items and summary
// GET /api/cart
router.get('/', cartController.getCart);

// Get cart summary (total items and amount)
// GET /api/cart/summary
router.get('/summary', cartController.getCartSummary);

// Check if specific product is in cart
// GET /api/cart/check/:productId
router.get('/check/:productId', cartController.isInCart);

// Add item to cart
// POST /api/cart/add
router.post('/add', validateAddToCart, validationResults, cartController.addToCart);

// Update cart item quantity
// PUT /api/cart/update/:productId
router.put('/update/:productId', validateUpdateCartItem, validationResults, cartController.updateCartItem);

// Remove item from cart by product ID
// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', cartController.removeFromCart);

// Remove item from cart by cart ID
// DELETE /api/cart/remove-by-id/:cartId
router.delete('/remove-by-id/:cartId', cartController.removeFromCartById);

// Clear entire cart
// DELETE /api/cart/clear
router.delete('/clear', cartController.clearCart);

// Sync cart (bulk update - useful for frontend localStorage sync)
// POST /api/cart/sync
router.post('/sync', validateSyncCart, validationResults, cartController.syncCart);

module.exports = router;
