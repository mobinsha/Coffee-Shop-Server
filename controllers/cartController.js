const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const { sendResponse } = require('../utils/responseHandler');

/**
 * Cart Controller - Handles all cart-related operations
 * All operations require authentication
 */

// Get user's cart with all items
async function getCart(req, res, next) {
    try {
        const userId = req.user.id;
        
        // Get cart items
        const cartItems = await cartModel.getCartByUserId(userId);
        
        // Get cart summary
        const summary = await cartModel.getCartSummary(userId);
        
        sendResponse(res, 200, 'Cart retrieved successfully', {
            items: cartItems,
            summary: {
                totalItems: parseInt(summary.totalItems),
                totalAmount: parseInt(summary.totalAmount)
            }
        });
    } catch (err) {
        next(err);
    }
}

// Add item to cart
async function addToCart(req, res, next) {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        
        // Validate product exists
        try {
            await productModel.getProductById(productId);
        } catch (err) {
            return sendResponse(res, 404, 'Product not found');
        }
        
        // Validate quantity
        if (quantity < 1) {
            return sendResponse(res, 400, 'Quantity must be at least 1');
        }
        
        // Add to cart
        const result = await cartModel.addToCart(userId, productId, quantity);
        
        // Get the updated cart item with product details
        const cartItem = await cartModel.getCartItem(userId, productId);
        
        const message = result.updated 
            ? 'Product quantity updated in cart' 
            : 'Product added to cart successfully';
        
        sendResponse(res, 200, message, {
            cartItem,
            updated: result.updated
        });
    } catch (err) {
        next(err);
    }
}

// Update cart item quantity
async function updateCartItem(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const { quantity } = req.body;
        
        // Validate quantity
        if (quantity === undefined || quantity === null) {
            return sendResponse(res, 400, 'Quantity is required');
        }
        
        if (quantity < 0) {
            return sendResponse(res, 400, 'Quantity cannot be negative');
        }
        
        if (quantity === 0) {
            // Remove item if quantity is 0
            const result = await cartModel.removeFromCart(userId, productId);
            return sendResponse(res, 200, 'Item removed from cart', result);
        }
        
        // Update quantity
        await cartModel.updateCartItem(userId, productId, quantity);
        
        // Get updated cart item
        const cartItem = await cartModel.getCartItem(userId, productId);
        
        sendResponse(res, 200, 'Cart item updated successfully', cartItem);
    } catch (err) {
        if (err.message === 'Cart item not found') {
            return sendResponse(res, 404, 'Cart item not found');
        }
        next(err);
    }
}

// Remove item from cart
async function removeFromCart(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
        const result = await cartModel.removeFromCart(userId, productId);
        
        sendResponse(res, 200, 'Item removed from cart successfully', result);
    } catch (err) {
        if (err.message === 'Cart item not found') {
            return sendResponse(res, 404, 'Cart item not found');
        }
        next(err);
    }
}

// Remove item from cart by cart ID
async function removeFromCartById(req, res, next) {
    try {
        const userId = req.user.id;
        const cartId = req.params.cartId;
        
        const result = await cartModel.removeFromCartById(cartId, userId);
        
        sendResponse(res, 200, 'Item removed from cart successfully', result);
    } catch (err) {
        if (err.message === 'Cart item not found') {
            return sendResponse(res, 404, 'Cart item not found');
        }
        next(err);
    }
}

// Clear entire cart
async function clearCart(req, res, next) {
    try {
        const userId = req.user.id;
        
        const result = await cartModel.clearCart(userId);
        
        sendResponse(res, 200, 'Cart cleared successfully', result);
    } catch (err) {
        next(err);
    }
}

// Get cart summary (total items and amount)
async function getCartSummary(req, res, next) {
    try {
        const userId = req.user.id;
        
        const summary = await cartModel.getCartSummary(userId);
        
        sendResponse(res, 200, 'Cart summary retrieved', {
            totalItems: parseInt(summary.totalItems),
            totalAmount: parseInt(summary.totalAmount)
        });
    } catch (err) {
        next(err);
    }
}

// Check if product is in cart
async function isInCart(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        
        const cartItem = await cartModel.isInCart(userId, productId);
        
        sendResponse(res, 200, 'Cart status retrieved', {
            inCart: !!cartItem,
            cartItem: cartItem || null
        });
    } catch (err) {
        next(err);
    }
}

// Sync cart (for bulk updates - useful for frontend)
async function syncCart(req, res, next) {
    try {
        const userId = req.user.id;
        const { items } = req.body; // Array of { productId, quantity }
        
        if (!Array.isArray(items)) {
            return sendResponse(res, 400, 'Items must be an array');
        }
        
        const results = {
            added: [],
            updated: [],
            removed: [],
            failed: []
        };
        
        // Clear existing cart first
        await cartModel.clearCart(userId);
        
        // Add new items
        for (const item of items) {
            try {
                if (!item.productId || item.quantity <= 0) {
                    results.failed.push({ item, reason: 'Invalid productId or quantity' });
                    continue;
                }
                
                // Check if product exists
                await productModel.getProductById(item.productId);
                
                // Add to cart
                const result = await cartModel.addToCart(userId, item.productId, item.quantity);
                
                if (result.updated) {
                    results.updated.push({ productId: item.productId, quantity: item.quantity });
                } else {
                    results.added.push({ productId: item.productId, quantity: item.quantity });
                }
            } catch (err) {
                results.failed.push({ item, reason: err.message });
            }
        }
        
        // Get updated cart
        const cartItems = await cartModel.getCartByUserId(userId);
        const summary = await cartModel.getCartSummary(userId);
        
        sendResponse(res, 200, 'Cart synchronized successfully', {
            syncResults: results,
            cart: {
                items: cartItems,
                summary: {
                    totalItems: parseInt(summary.totalItems),
                    totalAmount: parseInt(summary.totalAmount)
                }
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    removeFromCartById,
    clearCart,
    getCartSummary,
    isInCart,
    syncCart
};
