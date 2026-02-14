// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize back to top button
    initBackToTop();
    
    // Update cart count
    updateCartCount();
    
    // Get order total from localStorage
    const orderTotal = localStorage.getItem('thaara-order-total');
    if (orderTotal) {
        document.getElementById('display-total').textContent = `LKR ${orderTotal}`;
    } else {
        document.getElementById('display-total').textContent = 'Not available';
    }
    
    // Populate years dropdown
    populateYears();
    
    // Get all form elements
    const cardholderNameInput = document.getElementById('name');
    const cardNumberInput = document.getElementById('card-number');
    const cvnInput = document.getElementById('cvn');
    const expiryMonthSelect = document.getElementById('expiry-month');
    const expiryYearSelect = document.getElementById('expiry-year');
    const backToDeliveryButton = document.getElementById('backToDelivery');
    const completePaymentButton = document.getElementById('completePayment');
    
    // Format card number with spaces
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value;
        
        // Remove error on input
        if (cardNumberInput.classList.contains('input-error')) {
            hideError(cardNumberInput, 'card-number-error');
        }
    });
    
    // Name validation - letters only
    cardholderNameInput.addEventListener('blur', function() {
        validateCardholderName();
    });
    
    cardholderNameInput.addEventListener('input', function() {
        // Remove error on input
        if (cardholderNameInput.classList.contains('input-error')) {
            hideError(cardholderNameInput, 'name-error');
        }
    });
    
    // Card number validation - 15 or 16 digits
    cardNumberInput.addEventListener('blur', function() {
        validateCardNumber();
    });
    
    // CVN validation - 3 or 4 digits
    cvnInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
        
        // Remove error on input
        if (cvnInput.classList.contains('input-error')) {
            hideError(cvnInput, 'cvn-error');
        }
    });
    
    cvnInput.addEventListener('blur', function() {
        validateCVN();
    });
    
    // Expiry date validation
    expiryMonthSelect.addEventListener('change', function() {
        validateExpiryDate();
    });
    
    expiryYearSelect.addEventListener('change', function() {
        validateExpiryDate();
    });
    
    // Card type selection
    const cardTypes = document.querySelectorAll('.card-type');
    cardTypes.forEach(card => {
        card.addEventListener('click', function() {
            cardTypes.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('card-type-input').value = this.getAttribute('data-card');
        });
    });
    
    // Back to delivery button
    backToDeliveryButton.addEventListener('click', function() {
        window.location.href = 'Delivery Details Page.html';
    });
    
// Replace only the complete payment button click handler with this code:

    completePaymentButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const paymentData = {
                cardholderName: cardholderNameInput.value,
                cardType: document.getElementById('card-type-input').value,
                lastFourDigits: cardNumberInput.value.replace(/\s+/g, '').slice(-4)
            };
            
            localStorage.setItem('paymentData', JSON.stringify(paymentData));
            
            setTimeout(() => window.location.href = "payment-loading.html", 100);
        }
    });
        
    // Validation functions
    function validateCardholderName() {
        const namePattern = /^[A-Za-z\s]+$/;
        const isValid = namePattern.test(cardholderNameInput.value);
        
        if (!isValid) {
            showError(cardholderNameInput, 'name-error');
            return false;
        } else {
            hideError(cardholderNameInput, 'name-error');
            return true;
        }
    }
    
    function validateCardNumber() {
        const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
        const isValid = /^\d{15,16}$/.test(cardNumber);
        
        if (!isValid) {
            showError(cardNumberInput, 'card-number-error');
            return false;
        } else {
            hideError(cardNumberInput, 'card-number-error');
            return true;
        }
    }
    
    function validateCVN() {
        const isValid = /^\d{3,4}$/.test(cvnInput.value);
        
        if (!isValid) {
            showError(cvnInput, 'cvn-error');
            return false;
        } else {
            hideError(cvnInput, 'cvn-error');
            return true;
        }
    }
    
    function validateExpiryDate() {
        if (expiryMonthSelect.value === '' || expiryYearSelect.value === '') {
            showError(expiryMonthSelect, 'expiry-error');
            return false;
        }
        
        const selectedMonth = parseInt(expiryMonthSelect.value);
        const selectedYear = parseInt(expiryYearSelect.value);
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() is zero-based
        const currentYear = now.getFullYear();
        
        const isValid = (selectedYear > currentYear) || 
                      (selectedYear === currentYear && selectedMonth >= currentMonth);
        
        if (!isValid) {
            showError(expiryMonthSelect, 'expiry-error');
            return false;
        } else {
            hideError(expiryMonthSelect, 'expiry-error');
            return true;
        }
    }
    
    function validateForm() {
        // Run all validations and capture results
        const nameValid = validateCardholderName();
        const cardNumberValid = validateCardNumber();
        const cvnValid = validateCVN();
        const expiryValid = validateExpiryDate();
        
        // Return overall form validity
        return nameValid && cardNumberValid && cvnValid && expiryValid;
    }
    
    // Helper functions for error handling
    function showError(field, errorId) {
        const errorElement = document.getElementById(errorId);
        
        field.classList.add('input-error');
        errorElement.style.display = 'block';
    }
    
    function hideError(field, errorId) {
        const errorElement = document.getElementById(errorId);
        
        field.classList.remove('input-error');
        errorElement.style.display = 'none';
    }
});

// Populate years dropdown
function populateYears() {
    const yearSelect = document.getElementById('expiry-year');
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 10; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

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

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}