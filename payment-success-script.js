// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize back to top button
    initBackToTop();
    
    // Display order total and update cart
    const orderTotal = localStorage.getItem('thaara-order-total');
    document.getElementById('display-total').textContent = orderTotal ? `LKR ${orderTotal}` : 'Total not available';
    
    // Clear cart after order
    localStorage.removeItem('thaara-cart');
    updateCartCount();
    
    // Demo countdown (5 seconds instead of minutes for testing)
    let minutes = 45;
    const minutesElement = document.querySelector('.minutes');
    
    const demoInterval = setInterval(function() {
        if (minutes > 0) {
            minutes--;
            minutesElement.textContent = minutes;
            
            // Update timeline progress
            if (minutes === 40) {
                document.querySelectorAll('.timeline-step')[1].classList.add('step-complete');
            }
            
            if (minutes === 25) {
                document.querySelectorAll('.timeline-step')[2].classList.add('step-complete');
                document.querySelectorAll('.timeline-step')[2].classList.add('step-next');
            }
            
            if (minutes === 0) {
                clearInterval(demoInterval);
            }
        }
    }, 5000);
});

// Update cart count
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

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}