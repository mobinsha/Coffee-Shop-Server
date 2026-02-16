const { dbConnection } = require("../config/dbConnection");
const { SendError } = require('../utils/sendError');

/**
 * Cart Model - Manages shopping cart operations for users
 * Uses a 'cart' table to store cart items temporarily
 * before they become orders
 */

// Create cart table if not exists (this will be handled by seed.js or migration)
const CREATE_CART_TABLE = `
    CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES product(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (userId, productId),
        INDEX idx_userId (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci
`;

// Initialize cart table
async function initCartTable() {
    return new Promise((resolve, reject) => {
        dbConnection.query(CREATE_CART_TABLE, (err) => {
            if (err) {
                console.error('Error creating cart table:', err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

// Get all cart items for a user with product details
async function getCartByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id as cartId,
                c.userId,
                c.productId,
                c.quantity,
                c.addedAt,
                p.name,
                p.shortTitle,
                p.price,
                p.imageAddress,
                p.description,
                (c.quantity * p.price) as totalPrice
            FROM cart c
            JOIN product p ON c.productId = p.id
            WHERE c.userId = ?
            ORDER BY c.addedAt DESC
        `;
        
        dbConnection.query(query, [userId], (err, results) => {
            if (err) return reject(new SendError(500, err));
            resolve(results);
        });
    });
}

// Get cart summary (total items and total amount)
async function getCartSummary(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                COUNT(*) as totalItems,
                COALESCE(SUM(c.quantity * p.price), 0) as totalAmount
            FROM cart c
            JOIN product p ON c.productId = p.id
            WHERE c.userId = ?
        `;
        
        dbConnection.query(query, [userId], (err, results) => {
            if (err) return reject(new SendError(500, err));
            resolve(results[0] || { totalItems: 0, totalAmount: 0 });
        });
    });
}

// Add item to cart (or update quantity if already exists)
async function addToCart(userId, productId, quantity = 1) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if item already exists in cart
            const checkQuery = 'SELECT * FROM cart WHERE userId = ? AND productId = ?';
            
            dbConnection.query(checkQuery, [userId, productId], (err, results) => {
                if (err) return reject(new SendError(500, err));
                
                if (results.length > 0) {
                    // Item exists, update quantity
                    const newQuantity = results[0].quantity + quantity;
                    const updateQuery = 'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?';
                    
                    dbConnection.query(updateQuery, [newQuantity, userId, productId], (err, result) => {
                        if (err) return reject(new SendError(500, err));
                        resolve({ 
                            cartId: results[0].id,
                            userId, 
                            productId, 
                            quantity: newQuantity,
                            updated: true 
                        });
                    });
                } else {
                    // Item doesn't exist, insert new
                    const insertQuery = 'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)';
                    
                    dbConnection.query(insertQuery, [userId, productId, quantity], (err, result) => {
                        if (err) return reject(new SendError(500, err));
                        resolve({ 
                            cartId: result.insertId,
                            userId, 
                            productId, 
                            quantity,
                            updated: false 
                        });
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Update cart item quantity
async function updateCartItem(userId, productId, quantity) {
    return new Promise((resolve, reject) => {
        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            return removeFromCart(userId, productId)
                .then(resolve)
                .catch(reject);
        }
        
        const query = 'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?';
        
        dbConnection.query(query, [quantity, userId, productId], (err, result) => {
            if (err) return reject(new SendError(500, err));
            if (result.affectedRows === 0) return reject(new SendError(404, 'Cart item not found'));
            resolve({ userId, productId, quantity });
        });
    });
}

// Remove item from cart
async function removeFromCart(userId, productId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cart WHERE userId = ? AND productId = ?';
        
        dbConnection.query(query, [userId, productId], (err, result) => {
            if (err) return reject(new SendError(500, err));
            if (result.affectedRows === 0) return reject(new SendError(404, 'Cart item not found'));
            resolve({ userId, productId, removed: true });
        });
    });
}

// Remove item from cart by cart ID
async function removeFromCartById(cartId, userId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cart WHERE id = ? AND userId = ?';
        
        dbConnection.query(query, [cartId, userId], (err, result) => {
            if (err) return reject(new SendError(500, err));
            if (result.affectedRows === 0) return reject(new SendError(404, 'Cart item not found'));
            resolve({ cartId, removed: true });
        });
    });
}

// Clear entire cart for a user
async function clearCart(userId) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM cart WHERE userId = ?';
        
        dbConnection.query(query, [userId], (err, result) => {
            if (err) return reject(new SendError(500, err));
            resolve({ userId, cleared: true, itemsRemoved: result.affectedRows });
        });
    });
}

// Check if product exists in user's cart
async function isInCart(userId, productId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM cart WHERE userId = ? AND productId = ?';
        
        dbConnection.query(query, [userId, productId], (err, results) => {
            if (err) return reject(new SendError(500, err));
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

// Get single cart item with product details
async function getCartItem(userId, productId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id as cartId,
                c.userId,
                c.productId,
                c.quantity,
                c.addedAt,
                p.name,
                p.shortTitle,
                p.price,
                p.imageAddress,
                p.description,
                (c.quantity * p.price) as totalPrice
            FROM cart c
            JOIN product p ON c.productId = p.id
            WHERE c.userId = ? AND c.productId = ?
        `;
        
        dbConnection.query(query, [userId, productId], (err, results) => {
            if (err) return reject(new SendError(500, err));
            if (results.length === 0) return reject(new SendError(404, 'Cart item not found'));
            resolve(results[0]);
        });
    });
}

module.exports = {
    initCartTable,
    getCartByUserId,
    getCartSummary,
    addToCart,
    updateCartItem,
    removeFromCart,
    removeFromCartById,
    clearCart,
    isInCart,
    getCartItem
};
