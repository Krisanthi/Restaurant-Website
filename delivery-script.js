// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize back to top button
    initBackToTop();
    
    // Update cart count from localStorage
    updateCartCount();
    
    // Form elements
    const form = document.getElementById('deliveryForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const deliveryTimeSelect = document.getElementById('deliveryTime');
    const backToCartButton = document.getElementById('backToCart');
    const proceedToPaymentButton = document.getElementById('proceedToPayment');
    
    // Validation patterns
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    
    // Back to cart button event
    backToCartButton.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    // Input validation events
    fullNameInput.addEventListener('blur', function() {
        validateFullName();
    });
    
    fullNameInput.addEventListener('input', function() {
        // Remove error on input
        if (fullNameInput.classList.contains('field-error')) {
            hideError(fullNameInput, 'fullNameError');
        }
    });
    
    emailInput.addEventListener('blur', function() {
        validateEmail();
    });
    
    emailInput.addEventListener('input', function() {
        // Remove error on input
        if (emailInput.classList.contains('field-error')) {
            hideError(emailInput, 'emailError');
        }
    });
    
    phoneInput.addEventListener('blur', function() {
        validatePhone();
    });
    
    phoneInput.addEventListener('input', function() {
        // Allow only numbers in the input
        this.value = this.value.replace(/[^\d]/g, '');
        
        // Remove error on input
        if (phoneInput.classList.contains('field-error')) {
            hideError(phoneInput, 'phoneError');
        }
    });
    
    deliveryTimeSelect.addEventListener('change', function() {
        validateDeliveryTime();
    });
    
    addressInput.addEventListener('blur', function() {
        validateAddress();
    });
    
    addressInput.addEventListener('input', function() {
        // Remove error on input
        if (addressInput.classList.contains('field-error')) {
            hideError(addressInput, 'addressError');
        }
    });
    
    // Form submission
    proceedToPaymentButton.addEventListener('click', function() {
        if (validateForm()) {
            // Save form data to localStorage
            const formData = {
                fullName: fullNameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                address: addressInput.value,
                deliveryType: document.querySelector('input[name="deliveryType"]:checked').value,
                deliveryTime: deliveryTimeSelect.value,
                instructions: document.getElementById('instructions').value
            };
            
            localStorage.setItem('deliveryData', JSON.stringify(formData));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
    
    // Validation functions
    function validateFullName() {
        const isValid = namePattern.test(fullNameInput.value);
        if (!isValid) {
            showError(fullNameInput, 'fullNameError');
            return false;
        } else {
            hideError(fullNameInput, 'fullNameError');
            return true;
        }
    }
    
    function validateEmail() {
        const isValid = emailPattern.test(emailInput.value);
        if (!isValid) {
            showError(emailInput, 'emailError');
            return false;
        } else {
            hideError(emailInput, 'emailError');
            return true;
        }
    }
    
    function validatePhone() {
        const isValid = phonePattern.test(phoneInput.value);
        if (!isValid) {
            showError(phoneInput, 'phoneError');
            return false;
        } else {
            hideError(phoneInput, 'phoneError');
            return true;
        }
    }
    
    function validateDeliveryTime() {
        if (!deliveryTimeSelect.value) {
            showError(deliveryTimeSelect, 'deliveryTimeError');
            return false;
        } else {
            hideError(deliveryTimeSelect, 'deliveryTimeError');
            return true;
        }
    }
    
    function validateAddress() {
        if (!addressInput.value.trim()) {
            showError(addressInput, 'addressError');
            return false;
        } else {
            hideError(addressInput, 'addressError');
            return true;
        }
    }
    
    function validateForm() {
        // Run all validations and capture results
        const nameValid = validateFullName();
        const emailValid = validateEmail();
        const phoneValid = validatePhone();
        const deliveryTimeValid = validateDeliveryTime();
        const addressValid = validateAddress();
        
        // Return overall form validity
        return nameValid && emailValid && phoneValid && deliveryTimeValid && addressValid;
    }
    
    // Helper functions
    function showError(field, errorId) {
        document.getElementById(errorId).style.display = 'block';
        field.classList.add('field-error');
    }
    
    function hideError(field, errorId) {
        document.getElementById(errorId).style.display = 'none';
        field.classList.remove('field-error');
    }
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