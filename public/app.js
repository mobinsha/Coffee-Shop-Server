/**
 * Coffee Shop Frontend Application
 * Handles API interactions, dynamic content loading, and UI interactions
 */

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';
const BASE_URL = 'http://localhost:3000';

// State management
let authToken = localStorage.getItem('authToken');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Helper function to get correct image URL
function getImageUrl(imageAddress) {
    if (!imageAddress) return null;
    if (imageAddress.startsWith('http')) {
        return imageAddress;
    }
    return BASE_URL + imageAddress;
}

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');

// ============================================
// Utility Functions
// ============================================

/**
 * Show loading overlay
 */
function showLoading() {
    loadingOverlay.classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error)
 */
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    const icon = toast.querySelector('i');
    
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        toast.style.background = '#dc3545';
    } else {
        icon.className = 'fas fa-check-circle';
        toast.style.background = 'var(--dark-brown)';
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            // Handle validation errors
            if (data.error && Array.isArray(data.error)) {
                const errorMessages = data.error.map(err => err.msg);
                const formattedMessage = errorMessages.join(' / ');
                throw new Error(formattedMessage);
            }
            throw new Error(data.message || 'خطا در ارتباط با سرور');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// Data Loading Functions
// ============================================

/**
 * Load menu items
 */
async function loadMenu() {
    try {
        const data = await apiRequest('/menu');
        const menuGrid = document.getElementById('menuGrid');
        
        if (!data.data || data.data.length === 0) {
            menuGrid.innerHTML = '<p class="empty-state">موردی یافت نشد</p>';
            return;
        }
        
        menuGrid.innerHTML = data.data.map(item => `
            <div class="menu-card fade-in-up">
                <div class="menu-card-image" style="${item.imageAddress ? `background-image: url('${getImageUrl(item.imageAddress)}'); background-size: cover; background-position: center;` : ''}">
                    ${!item.imageAddress ? '<i class="fas fa-coffee"></i>' : ''}
                </div>
                <div class="menu-card-content">
                    <h4 class="menu-card-title">${item.name}</h4>
                    <div class="menu-card-price">
                        ${item.price.toLocaleString('fa-IR')} 
                        <span>تومان</span>
                    </div>
                    <button class="menu-card-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.imageAddress || ''}')">
                        <i class="fas fa-plus"></i>
                        <span>افزودن به سبد</span>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading menu:', error);
        showToast('خطا در بارگذاری منو', 'error');
    }
}

/**
 * Load products
 */
async function loadProducts() {
    try {
        console.log('Loading products...');
        const data = await apiRequest('/product');
        console.log('Products data:', data);
        const productsGrid = document.getElementById('productsGrid');
        console.log('Products grid element:', productsGrid);
        
        if (!productsGrid) {
            console.error('productsGrid element not found!');
            return;
        }
        
        if (!data || !data.data || data.data.length === 0) {
            console.log('No products found');
            productsGrid.innerHTML = '<p class="empty-state">موردی یافت نشد</p>';
            return;
        }
        console.log('Rendering', data.data.length, 'products');
        
        productsGrid.innerHTML = data.data.map((product, index) => `
            <div class="product-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="product-image" style="${product.imageAddress ? `background-image: url('${getImageUrl(product.imageAddress)}'); background-size: cover; background-position: center;` : ''}">
                    ${!product.imageAddress ? '<i class="fas fa-mug-hot"></i>' : ''}
                    ${index < 3 ? '<span class="product-badge">ویژه</span>' : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-short-title">${product.shortTitle || ''}</p>
                    <p class="product-description">${product.description || 'توضیحاتی ثبت نشده'}</p>
                    <div class="product-footer">
                        <div class="product-price">
                            ${product.price.toLocaleString('fa-IR')}
                            <span>تومان</span>
                        </div>
                        <button class="product-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.imageAddress || ''}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('خطا در بارگذاری محصولات', 'error');
    }
}

/**
 * Load recommended items
 */
async function loadRecommended() {
    try {
        const data = await apiRequest('/recommended');
        const recommendedCarousel = document.getElementById('recommendedCarousel');
        
        if (!data.data || data.data.length === 0) {
            recommendedCarousel.innerHTML = '<p class="empty-state">موردی یافت نشد</p>';
            return;
        }
        
        const icons = ['fa-coffee', 'fa-mug-hot', 'fa-glass-water', 'fa-wine-glass', 'fa-whiskey-glass'];
        
        recommendedCarousel.innerHTML = data.data.slice(0, 4).map((item, index) => `
            <div class="recommended-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="recommended-icon" style="${item.imageAddress ? `background-image: url('${getImageUrl(item.imageAddress)}'); background-size: cover; background-position: center; width: 100%; height: 120px; border-radius: 8px; margin-bottom: 12px;` : ''}">
                    ${!item.imageAddress ? `<i class="fas ${icons[index % icons.length]}"></i>` : ''}
                </div>
                <h4 class="recommended-title">${item.name}</h4>
                <div class="recommended-price">
                    ${item.price.toLocaleString('fa-IR')} تومان
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recommended:', error);
        showToast('خطا در بارگذاری پیشنهادات', 'error');
    }
}

/**
 * Load services
 */
async function loadServices() {
    try {
        const data = await apiRequest('/services');
        const servicesGrid = document.getElementById('servicesGrid');
        
        if (!data.data || data.data.length === 0) {
            servicesGrid.innerHTML = '<p class="empty-state">موردی یافت نشد</p>';
            return;
        }
        
        // Icon mapping for Persian service names
        const iconMap = {
            'پذیرایی': 'fa-concierge-bell',
            'پذیرایی ویژه': 'fa-concierge-bell',
            'قهوه': 'fa-mug-hot',
            'قهوه‌های دمی': 'fa-mug-hot',
            'بیرون‌بر': 'fa-bag-shopping',
            'بسته‌بندی بیرون‌بر': 'fa-bag-shopping',
            'دسر': 'fa-cookie-bite',
            'دسرهای روز': 'fa-cookie-bite',
            'تجهیزات': 'fa-blender',
            'تجهیزات barista': 'fa-blender'
        };
        
        servicesGrid.innerHTML = data.data.slice(0, 4).map((service, index) => {
            // Try to find icon by exact match or partial match
            let iconClass = 'fa-coffee';
            const serviceName = service.name;
            
            if (iconMap[serviceName]) {
                iconClass = iconMap[serviceName];
            } else {
                // Try partial matching
                for (const [key, value] of Object.entries(iconMap)) {
                    if (serviceName.includes(key)) {
                        iconClass = value;
                        break;
                    }
                }
            }
            
            return `
                <div class="service-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                    <div class="service-icon" style="${service.imageAddress ? `background-image: url('${getImageUrl(service.imageAddress)}'); background-size: cover; background-position: center; overflow: hidden;` : ''}">
                        ${!service.imageAddress ? `<i class="fas ${iconClass}"></i>` : ''}
                    </div>
                    <h4 class="service-title">${service.name}</h4>
                    ${service.description ? `<p class="service-desc">${service.description}</p>` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading services:', error);
        showToast('خطا در بارگذاری خدمات', 'error');
    }
}

/**
 * Load blogs
 */
async function loadBlogs() {
    try {
        const data = await apiRequest('/blogs');
        const blogsGrid = document.getElementById('blogsGrid');
        
        if (!data.data || data.data.length === 0) {
            blogsGrid.innerHTML = '<p class="empty-state">موردی یافت نشد</p>';
            return;
        }
        
        const icons = ['fa-newspaper', 'fa-book-open', 'fa-file-alt'];
        
        blogsGrid.innerHTML = data.data.slice(0, 6).map((blog, index) => `
            <div class="blog-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="blog-image" style="${blog.imageAddress ? `background-image: url('${getImageUrl(blog.imageAddress)}'); background-size: cover; background-position: center;` : ''}">
                    ${!blog.imageAddress ? `<i class="fas ${icons[index % icons.length]}"></i>` : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-date">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(blog.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.content ? blog.content.substring(0, 150) : ''}...</p>
                    <a href="#" class="blog-link">
                        <span>ادامه مطلب</span>
                        <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading blogs:', error);
        showToast('خطا در بارگذاری وبلاگ', 'error');
    }
}

// ============================================
// Cart Functions
// ============================================

/**
 * Add item to cart
 * @param {number} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} image - Product image
 */
function addToCart(id, name, price, image = null) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1, image });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showToast(`${name} به سبد خرید اضافه شد`);
}

/**
 * Remove item from cart
 * @param {number} id - Product ID
 */
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showToast('محصول از سبد حذف شد');
}

/**
 * Update item quantity
 * @param {number} id - Product ID
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartModal();
        }
    }
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

/**
 * Update cart modal content
 */
function updateCartModal() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>سبد خرید شما خالی است</p>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    let total = 0;
    cartBody.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image || 'https://via.placeholder.com/80?text=No+Image'}" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('fa-IR')} تومان</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toLocaleString('fa-IR') + ' تومان';
    cartFooter.style.display = 'block';
}

/**
 * Open cart modal
 */
function openCartModal() {
    updateCartModal();
    cartModal.classList.add('active');
}

/**
 * Checkout (dummy function)
 */
function checkout() {
    showToast('در حال حاضر امکان پرداخت وجود ندارد', 'warning');
}

// ============================================
// Auth Functions
// ============================================



// ============================================
// Modal Functions
// ============================================

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Animation Functions
// ============================================

/**
 * Animate numbers in stats section
 */
function animateNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('fa-IR') + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('fa-IR') + '+';
            }
        };
        
        updateCounter();
    });
}

/**
 * Intersection Observer for animations
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stats animation
                if (entry.target.closest('.stats')) {
                    animateNumbers();
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.stat-card, .menu-card, .product-card, .service-card, .blog-card, .recommended-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Event Listeners
// ============================================

// Modal events
if (cartBtn) {
    cartBtn.addEventListener('click', openCartModal);
}
if (closeCartModal) {
    closeCartModal.addEventListener('click', () => closeModal(cartModal));
}

// Checkout button
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
}

// Mobile navigation
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === cartModal) closeModal(cartModal);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navMenu.classList.remove('active');
        }
    });
});

// Newsletter form
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('از عضویت شما متشکریم!');
    e.target.reset();
});

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('App initializing...');
        
        // Initialize cart count
        updateCartCount();
        
        // Load data with error handling
        console.log('Loading menu...');
        await loadMenu();
        
        console.log('Loading products...');
        await loadProducts();
        
        console.log('Loading recommended...');
        await loadRecommended();
        
        console.log('Loading services...');
        await loadServices();
        
        console.log('Loading blogs...');
        await loadBlogs();
        
        // Initialize animations
        console.log('Initializing animations...');
        initScrollAnimations();
        
        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});
