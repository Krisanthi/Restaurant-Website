// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Redirect to success page after 5 seconds
    setTimeout(function() {
        window.location.href = "payment-success-page.html";
    }, 5000);
});

// Function to update cart count from localStorage
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    const savedCart = localStorage.getItem('thaara-cart');
    let count = 0;
    
    if (savedCart) {
        const cart = JSON.parse(savedCart);
        count = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    cartCountElement.textContent = count;
}