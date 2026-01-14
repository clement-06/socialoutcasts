/**
 * shop.js - Handles product interactions on the Shop page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Handle Size Button Selection
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const sizeButtons = card.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons in this card
                sizeButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
            });
        });
    });

    const addButtons = document.querySelectorAll('.add-btn');

    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const productCard = btn.closest('.product-card');
            if (!productCard) return;

            // Get selected size
            const activeSizeBtn = productCard.querySelector('.size-btn.active');
            const size = activeSizeBtn ? activeSizeBtn.dataset.size : 'M'; // Default to M if none active

            // Extract product data from the card
            const name = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const image = productCard.querySelector('img')?.src || '';

            const product = {
                name,
                price,
                image,
                size // Added size property
            };

            // Call global function from main.js
            if (typeof addToCart === 'function') {
                addToCart(product);
                
                // Button Feedback
                const originalText = btn.textContent;
                btn.textContent = 'Added ✓';
                btn.classList.add('btn-success');
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 1500);
            } else {
                console.error('addToCart function not found. Ensure main.js is loaded.');
            }
        });
    });
});
