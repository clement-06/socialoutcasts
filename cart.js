/**
 * cart.js - Handles cart page rendering and calculations.
 */

document.addEventListener('DOMContentLoaded', () => {
    window.renderCart();
});

/**
 * Renders the cart items and updates the summary.
 */
window.renderCart = function() {
    const cartContainer = document.querySelector('.cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.cart-summary .btn');
    
    if (!cartContainer) return;

    // Use the global cart variable if available, otherwise fetch from storage
    const cartItems = (typeof cart !== 'undefined' && cart.length > 0) 
        ? cart 
        : (JSON.parse(localStorage.getItem('so_cart')) || []);

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-display" style="text-align: center; padding: 4rem 1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <h2 style="margin-bottom: 10px;">Your cart is empty</h2>
                <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't added anything yet.</p>
                <a href="shop.html" class="btn" style="text-decoration: none; display: inline-block;">Browse Shop</a>
            </div>
        `;
        totalElement.textContent = 'GHS 0.00';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    if (checkoutBtn) checkoutBtn.style.display = 'block';

    let html = '';
    let total = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item" data-index="${index}" style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 0; border-bottom: 1px solid #eee;">
                <div class="item-details" style="display: flex; align-items: center; gap: 20px;">
                    <div class="cart-img-wrapper" style="width: 100px; height: 100px; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <img src="${item.image}" alt="${item.name}" class="cart-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                    </div>
                    <div class="item-info">
                        <h3 style="font-size: 1.1rem; margin-bottom: 5px; font-weight: 600;">${item.name}</h3>
                        <p style="font-size: 0.85rem; color: #888; margin-bottom: 5px;">Size: <span style="color: #000; font-weight: 600;">${item.size || 'M'}</span></p>
                        <p class="unit-price" style="color: #666; font-size: 0.9rem;">GHS ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="item-actions" style="display: flex; align-items: center; gap: 30px;">
                    <div class="quantity-controls" style="display: flex; align-items: center; gap: 15px; background: #f9f9f9; padding: 5px 12px; border-radius: 20px;">
                        <button onclick="changeQuantity(${index}, -1)" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 5px;">-</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 5px;">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})" style="background: none; border: none; cursor: pointer; color: #ff4444; transition: color 0.2s;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    totalElement.textContent = `GHS ${total.toFixed(2)}`;
};

/**
 * Changes quantity of an item.
 */
window.changeQuantity = (index, delta) => {
    if (typeof cart !== 'undefined') {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartCount();
        renderCart();
    }
};

/**
 * Removes an item from cart.
 */
window.removeItem = (index) => {
    if (typeof cart !== 'undefined') {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
        if (typeof showNotification === 'function') {
            showNotification(`Removed ${itemName} from cart`);
        }
    }
};

/**
 * Checkout simulation.
 */
const checkoutBtn = document.querySelector('.cart-summary .btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        checkoutBtn.textContent = 'Processing...';
        checkoutBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your order! This is a simulation. In a real store, you would be redirected to a payment gateway.');
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
            
            checkoutBtn.textContent = 'Proceed to Checkout';
            checkoutBtn.disabled = false;
        }, 2000);
    });
}
