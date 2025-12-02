document.addEventListener('DOMContentLoaded', function() {
    console.log('Lion Kicks - Ready!');
    
    // Initialize all components
    initMobileMenu();
    initFormValidation();
    initImageLazyLoading();
    initToastNotifications();
    initPasswordToggles();
    initCartQuantity();
    initSmoothScroll();
});

// ===== Mobile Menu =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            // Toggle button icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars';
                } else {
                    icon.className = 'fas fa-times';
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}

// ===== Form Validation =====
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
            }
        });
        
        // Real-time validation on input
        const inputs = form.querySelectorAll('input[data-validate]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validation for password confirmation
    const password = form.querySelector('input[type="password"][name="password"]');
    const confirmPassword = form.querySelector('input[type="password"][name="confirmPassword"]');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    
    // Required check
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (name === 'password' && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

// ===== Image Lazy Loading =====
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== Toast Notifications =====
function initToastNotifications() {
    // Check for URL success/error messages
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success) {
        showToast(decodeURIComponent(success), 'success');
    }
    
    if (error) {
        showToast(decodeURIComponent(error), 'error');
    }
}

function showToast(message, type = 'info', duration = 5000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type} flex items-center p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };
    
    toast.classList.add(...colors[type].split(' '));
    
    // Add icon
    const icons = {
        success: '✓',
        error: '✗',
        info: 'ℹ',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="mr-3">${icons[type]}</span>
        <span class="flex-1">${message}</span>
        <button class="ml-4 text-xl hover:opacity-75" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove
    const autoRemove = setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Pause auto-remove on hover
    toast.addEventListener('mouseenter', () => clearTimeout(autoRemove));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    });
}

// ===== Password Visibility Toggle =====
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
}

// ===== Cart Quantity Controls =====
function initCartQuantity() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value) || 0;
            
            if (this.classList.contains('quantity-minus')) {
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            } else if (this.classList.contains('quantity-plus')) {
                if (currentValue < parseInt(input.max || 99)) {
                    input.value = currentValue + 1;
                }
            }
            
            // Trigger change event
            input.dispatchEvent(new Event('change'));
        });
    });
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Price Formatting =====
function formatPrice(amount, currency = 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    });
    
    return formatter.format(amount);
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    // Simple conversion (in real app, use API)
    const rates = {
        USD: 1,
        FRW: 1250
    };
    
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        return amount;
    }
    
    return (amount / rates[fromCurrency]) * rates[toCurrency];
}

// ===== Cart Management =====
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('lionKicksCart')) || [];
        this.updateCartDisplay();
    }
    
    addItem(productId, quantity = 1, size, color) {
        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId,
                quantity,
                size,
                color,
                addedAt: new Date().toISOString()
            });
        }
        
        this.save();
        this.updateCartDisplay();
        showToast('Item added to cart', 'success');
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.save();
        this.updateCartDisplay();
        showToast('Item removed from cart', 'success');
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            item.quantity = quantity;
            this.save();
            this.updateCartDisplay();
        }
    }
    
    clear() {
        this.items = [];
        this.save();
        this.updateCartDisplay();
    }
    
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    save() {
        localStorage.setItem('lionKicksCart', JSON.stringify(this.items));
    }
    
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const total = this.getTotalItems();
            cartCount.textContent = total;
            cartCount.classList.toggle('hidden', total === 0);
        }
    }
    
    getCart() {
        return this.items;
    }
}

// Initialize cart
window.cart = new Cart();

// ===== API Helpers =====
async function fetchJSON(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Network error occurred', 'error');
        throw error;
    }
}

// ===== Debounce Function =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Export for use in other scripts =====
window.LionKicks = {
    showToast,
    formatPrice,
    convertCurrency,
    cart
};
