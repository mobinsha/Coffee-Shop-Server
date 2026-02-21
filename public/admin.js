/**
 * Admin Panel JavaScript
 * Handles all admin panel functionality
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State Management
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
let deleteCallback = null;

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ============================================
// Utility Functions
// ============================================

function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    const icon = toast.querySelector('i');
    
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        toast.style.background = '#dc3545';
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-triangle';
        toast.style.background = '#ffc107';
        toast.style.color = '#000';
    } else {
        icon.className = 'fas fa-check-circle';
        toast.style.background = 'var(--dark-brown)';
        toast.style.color = '#fff';
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                throw new Error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
            }
            
            // Handle validation errors
            if (data.error && Array.isArray(data.error)) {
                // Extract all error messages
                const errorMessages = data.error.map(err => err.msg);
                // Join them with line breaks
                const errorMessage = errorMessages.join('\n• ');
                throw new Error('• ' + errorMessage);
            }
            
            throw new Error(data.message || 'خطا در ارتباط با سرور');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Show validation errors in modal
 * @param {Array} errors - Array of validation errors
 */
function showValidationErrors(errors) {
    if (!errors || !Array.isArray(errors)) return;
    
    const errorMessages = errors.map(err => err.msg);
    const formattedMessage = errorMessages.join(' / ');
    
    showToast(formattedMessage, 'error');
}

function formatPrice(price) {
    return parseInt(price).toLocaleString('fa-IR') + ' تومان';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getImageUrl(imageAddress) {
    if (!imageAddress) return null;
    if (imageAddress.startsWith('http')) return imageAddress;
    return `http://localhost:3000${imageAddress}`;
}

// ============================================
// Authentication
// ============================================

function checkAuth() {
    if (!authToken || !currentUser || currentUser.permission !== 'admin') {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login.html';
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('pageTitle');
    
    const pageTitles = {
        dashboard: 'داشبورد',
        products: 'مدیریت محصولات',
        services: 'مدیریت خدمات',
        blogs: 'مدیریت وبلاگ',
        users: 'مدیریت کاربران'
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show page section
            pageSections.forEach(section => section.classList.remove('active'));
            document.getElementById(page + 'Page').classList.add('active');
            
            // Update title
            pageTitle.textContent = pageTitles[page];
            
            // Load page data
            loadPageData(page);
            
            // Close mobile menu
            document.getElementById('sidebar').classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'products':
            loadProducts();
            break;
        case 'services':
            loadServices();
            break;
        case 'blogs':
            loadBlogs();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// ============================================
// Dashboard
// ============================================

async function loadDashboardStats() {
    showLoading();
    
    try {
        // Load all data in parallel
        const [productsRes, usersRes, servicesRes, blogsRes] = await Promise.all([
            apiRequest('/product'),
            apiRequest('/users'),
            apiRequest('/services'),
            apiRequest('/blogs')
        ]);
        
        // Update stats
        document.getElementById('totalProducts').textContent = productsRes.data?.length || 0;
        document.getElementById('totalUsers').textContent = usersRes.data?.length || 0;
        document.getElementById('totalServices').textContent = servicesRes.data?.length || 0;
        document.getElementById('totalBlogs').textContent = blogsRes.data?.length || 0;
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// ============================================
// Products Management
// ============================================

async function loadProducts() {
    showLoading();
    
    try {
        const response = await apiRequest('/product');
        const products = response.data || [];
        
        const tbody = document.getElementById('productsTable');
        
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-coffee"></i>
                        <h3>محصولی یافت نشد</h3>
                        <p>برای افزودن محصول جدید روی دکمه بالا کلیک کنید</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    ${product.imageAddress ? 
                        `<img src="${getImageUrl(product.imageAddress)}" class="table-image" alt="${product.name}">` :
                        `<div class="table-image-placeholder"><i class="fas fa-coffee"></i></div>`
                    }
                </td>
                <td><strong>${product.name}</strong></td>
                <td>${product.shortTitle || '-'}</td>
                <td>${formatPrice(product.price)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon edit" onclick="editProduct(${product.id})" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="confirmDeleteProduct(${product.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    
    if (product) {
        title.textContent = 'ویرایش محصول';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productShortTitle').value = product.shortTitle || '';
        document.getElementById('productImage').value = product.imageAddress || '';
        document.getElementById('productDescription').value = product.description || '';
    } else {
        title.textContent = 'افزودن محصول';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    modal.classList.add('active');
}

async function editProduct(id) {
    try {
        const response = await apiRequest(`/product/${id}`);
        openProductModal(response.data[0]);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    showLoading();
    
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        shortTitle: document.getElementById('productShortTitle').value,
        imageAddress: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };
    
    try {
        if (id) {
            // Update
            await apiRequest(`/product/update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('محصول با موفقیت بروزرسانی شد');
        } else {
            // Create
            await apiRequest('/product/add', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('محصول با موفقیت اضافه شد');
        }
        
        closeModal('productModal');
        loadProducts();
        loadDashboardStats();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function confirmDeleteProduct(id) {
    deleteCallback = async () => {
        showLoading();
        try {
            await apiRequest(`/product/delete/${id}`, { method: 'DELETE' });
            showToast('محصول با موفقیت حذف شد');
            loadProducts();
            loadDashboardStats();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoading();
            closeModal('deleteModal');
        }
    };
    
    document.getElementById('deleteModal').classList.add('active');
}

// ============================================
// Services Management
// ============================================

async function loadServices() {
    showLoading();
    
    try {
        const response = await apiRequest('/services');
        const services = response.data || [];
        
        const tbody = document.getElementById('servicesTable');
        
        if (services.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        <i class="fas fa-concierge-bell"></i>
                        <h3>خدمتی یافت نشد</h3>
                        <p>برای افزودن خدمات جدید روی دکمه بالا کلیک کنید</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = services.map(service => `
            <tr>
                <td>
                    ${service.imageAddress ? 
                        `<img src="${getImageUrl(service.imageAddress)}" class="table-image" alt="${service.name}">` :
                        `<div class="table-image-placeholder"><i class="fas fa-concierge-bell"></i></div>`
                    }
                </td>
                <td><strong>${service.name}</strong></td>
                <td>${service.description || '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon edit" onclick="editService(${service.id})" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="confirmDeleteService(${service.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function openServiceModal(service = null) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('serviceModalTitle');
    const form = document.getElementById('serviceForm');
    
    if (service) {
        title.textContent = 'ویرایش خدمات';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceImage').value = service.imageAddress || '';
        document.getElementById('serviceDescription').value = service.description || '';
    } else {
        title.textContent = 'افزودن خدمات';
        form.reset();
        document.getElementById('serviceId').value = '';
    }
    
    modal.classList.add('active');
}

async function editService(id) {
    try {
        const response = await apiRequest(`/services/${id}`);
        openServiceModal(response.data[0]);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function saveService() {
    const form = document.getElementById('serviceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    showLoading();
    
    const id = document.getElementById('serviceId').value;
    const data = {
        name: document.getElementById('serviceName').value,
        imageAddress: document.getElementById('serviceImage').value,
        description: document.getElementById('serviceDescription').value
    };
    
    try {
        if (id) {
            await apiRequest(`/services/update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('خدمات با موفقیت بروزرسانی شد');
        } else {
            await apiRequest('/services/add', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('خدمات با موفقیت اضافه شد');
        }
        
        closeModal('serviceModal');
        loadServices();
        loadDashboardStats();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function confirmDeleteService(id) {
    deleteCallback = async () => {
        showLoading();
        try {
            await apiRequest(`/services/delete/${id}`, { method: 'DELETE' });
            showToast('خدمات با موفقیت حذف شد');
            loadServices();
            loadDashboardStats();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoading();
            closeModal('deleteModal');
        }
    };
    
    document.getElementById('deleteModal').classList.add('active');
}

// ============================================
// Blogs Management
// ============================================

async function loadBlogs() {
    showLoading();
    
    try {
        const response = await apiRequest('/blogs');
        const blogs = response.data || [];
        
        const tbody = document.getElementById('blogsTable');
        
        if (blogs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        <i class="fas fa-newspaper"></i>
                        <h3>مقاله‌ای یافت نشد</h3>
                        <p>برای افزودن مقاله جدید روی دکمه بالا کلیک کنید</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = blogs.map(blog => `
            <tr>
                <td>
                    ${blog.imageAddress ? 
                        `<img src="${getImageUrl(blog.imageAddress)}" class="table-image" alt="${blog.title}">` :
                        `<div class="table-image-placeholder"><i class="fas fa-newspaper"></i></div>`
                    }
                </td>
                <td><strong>${blog.title}</strong></td>
                <td>${formatDate(blog.createdAt)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon edit" onclick="editBlog(${blog.id})" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="confirmDeleteBlog(${blog.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function openBlogModal(blog = null) {
    const modal = document.getElementById('blogModal');
    const title = document.getElementById('blogModalTitle');
    const form = document.getElementById('blogForm');
    
    if (blog) {
        title.textContent = 'ویرایش مقاله';
        document.getElementById('blogId').value = blog.id;
        document.getElementById('blogTitle').value = blog.title;
        document.getElementById('blogImage').value = blog.imageAddress || '';
        document.getElementById('blogContent').value = blog.content;
    } else {
        title.textContent = 'افزودن مقاله';
        form.reset();
        document.getElementById('blogId').value = '';
    }
    
    modal.classList.add('active');
}

async function editBlog(id) {
    try {
        const response = await apiRequest(`/blogs/${id}`);
        openBlogModal(response.data[0]);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function saveBlog() {
    const form = document.getElementById('blogForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    showLoading();
    
    const id = document.getElementById('blogId').value;
    const data = {
        title: document.getElementById('blogTitle').value,
        imageAddress: document.getElementById('blogImage').value,
        content: document.getElementById('blogContent').value
    };
    
    try {
        if (id) {
            await apiRequest(`/blogs/update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            showToast('مقاله با موفقیت بروزرسانی شد');
        } else {
            await apiRequest('/blogs/add', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showToast('مقاله با موفقیت اضافه شد');
        }
        
        closeModal('blogModal');
        loadBlogs();
        loadDashboardStats();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function confirmDeleteBlog(id) {
    deleteCallback = async () => {
        showLoading();
        try {
            await apiRequest(`/blogs/delete/${id}`, { method: 'DELETE' });
            showToast('مقاله با موفقیت حذف شد');
            loadBlogs();
            loadDashboardStats();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoading();
            closeModal('deleteModal');
        }
    };
    
    document.getElementById('deleteModal').classList.add('active');
}

// ============================================
// Users Management
// ============================================

async function loadUsers() {
    showLoading();
    
    try {
        const response = await apiRequest('/users');
        const users = response.data || [];
        
        const tbody = document.getElementById('usersTable');
        
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>کاربری یافت نشد</h3>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td><strong>${user.userName}</strong></td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                    <span class="status-badge ${user.permission}">
                        ${user.permission === 'admin' ? 'مدیر' : 'کاربر'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.accountStatus}">
                        ${user.accountStatus === 'active' ? 'فعال' : user.accountStatus === 'inactive' ? 'غیرفعال' : 'مسدود'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        ${user.id !== currentUser.id ? `
                            <button class="btn-icon delete" onclick="confirmDeleteUser(${user.id})" title="حذف">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : '<span style="color: var(--text-light); font-size: 0.85rem;">شما</span>'}
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

function confirmDeleteUser(id) {
    deleteCallback = async () => {
        showLoading();
        try {
            await apiRequest(`/users/delete/${id}`, { method: 'DELETE' });
            showToast('کاربر با موفقیت حذف شد');
            loadUsers();
            loadDashboardStats();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoading();
            closeModal('deleteModal');
        }
    };
    
    document.getElementById('deleteModal').classList.add('active');
}

// ============================================
// Modal Functions
// ============================================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Confirm delete
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        if (deleteCallback) {
            deleteCallback();
        }
    });
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
    const searchInputs = [
        { id: 'productSearch', tableId: 'productsTable' },
        { id: 'serviceSearch', tableId: 'servicesTable' },
        { id: 'blogSearch', tableId: 'blogsTable' },
        { id: 'userSearch', tableId: 'usersTable' }
    ];
    
    searchInputs.forEach(({ id, tableId }) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const rows = document.querySelectorAll(`#${tableId} tr`);
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(term) ? '' : 'none';
                });
            });
        }
    });
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    // Set admin name
    document.getElementById('adminName').textContent = currentUser.fullName || 'مدیر سیستم';
    
    // Initialize
    initNavigation();
    initSearch();
    loadDashboardStats();
});
