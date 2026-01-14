/**
 * main.js - Global JavaScript for Social OutCast
 * Handles shared functionality like cart storage and navbar updates.
 */

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('so_cart')) || [];

/**
 * Updates the navigation cart counter badge.
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Add a small animation effect
        cartCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => cartCountElement.style.transform = 'scale(1)', 200);
    }
}

/**
 * Adds a product to the cart and saves to localStorage.
 * @param {Object} product - {name, price, image, size}
 */
function addToCart(product) {
    // Check for existing item with SAME name AND SAME size
    const existingItem = cart.find(item => item.name === product.name && item.size === product.size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} (${product.size}) added to cart!`, product.image);
}

/**
 * Saves current cart state to localStorage.
 */
function saveCart() {
    localStorage.setItem('so_cart', JSON.stringify(cart));
}

/**
 * Simple toast notification system with product image support.
 */
function showNotification(message, imageUrl = null) {
    let container = document.getElementById('so-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'so-notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = 'so-notification';
    notification.style.cssText = `
        background: #000;
        color: #fff;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 1px solid #333;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 250px;
    `;

    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            width: 45px;
            height: 45px;
            object-fit: cover;
            border-radius: 4px;
            background: #222;
        `;
        notification.appendChild(img);
    }

    const text = document.createElement('span');
    text.textContent = message;
    notification.appendChild(text);
    
    container.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'so_cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            
            // If on cart page, re-render might be needed
            if (typeof renderCart === 'function') {
                renderCart();
            }
        }
    });
});
