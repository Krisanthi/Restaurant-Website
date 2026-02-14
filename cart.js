// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
    
    // Cart data and promo codes
    let cartItems = [];
    let appliedPromo = null;

    const promoCodes = {
        "WELCOME10": { discount: 0.10, description: "10% off your order" },
        "NEWYEAR25": { discount: 0.25, description: "25% off your order" },
        "FREEDEL": { discount: 0, deliveryFee: 0, description: "Free delivery" }
    };

    function saveCart() {
        localStorage.setItem('thaara-cart', JSON.stringify(cartItems));
        if (appliedPromo) {
            localStorage.setItem('thaara-promo', JSON.stringify(appliedPromo));
        }
        updateCartCount();
    }

    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            let count = cartItems.length > 0 ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
            cartCountElement.textContent = count;
        }
    }

    function loadCart() {
        const savedCart = localStorage.getItem('thaara-cart');
        if (savedCart) cartItems = JSON.parse(savedCart);
        
        const savedPromo = localStorage.getItem('thaara-promo');
        if (savedPromo) appliedPromo = JSON.parse(savedPromo);
        
        updateCartCount();
    }

    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart');
        const cartSummary = document.getElementById('cart-summary');
        
        // Clear container
        while (cartItemsContainer.firstChild && cartItemsContainer.firstChild !== emptyCartMessage) {
            cartItemsContainer.removeChild(cartItemsContainer.firstChild);
        }
        
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Add items to container
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">LKR ${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeItem('${item.id}')"><i class="fas fa-trash-alt"></i></button>
            `;
            
            cartItemsContainer.insertBefore(itemElement, emptyCartMessage);
        });
        
        updateSummary();
    }

    window.updateQuantity = function(itemId, change) {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                removeItem(itemId);
            } else {
                saveCart();
                renderCart();
                showCartMessage("Item quantity updated");
            }
        }
    };

    window.removeItem = function(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
        showCartMessage("Item removed from cart");
    };

    function showCartMessage(message) {
        const messageEl = document.getElementById('cart-message');
        
        messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        messageEl.classList.remove('hidden');
        messageEl.classList.add('visible');
        
        setTimeout(() => {
            messageEl.classList.remove('visible');
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    function applyPromoCode(code) {
        const promoMessage = document.getElementById('promo-message');
        const discountRow = document.getElementById('discount-row');
        
        if (promoCodes[code]) {
            appliedPromo = { code, ...promoCodes[code] };
            promoMessage.textContent = `${appliedPromo.description} applied!`
            promoMessage.style.color = '#008000';
            promoMessage.style.display = 'block';
            discountRow.style.display = 'flex';
            
            saveCart();
            updateSummary();
            showCartMessage("Promotion code applied!");
        } else {
            promoMessage.textContent = 'Invalid promotion code.';
            promoMessage.style.color = '#ff3b30';
            promoMessage.style.display = 'block';
        }
    }

    function updateSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let deliveryFee = 150.00;
        const tax = subtotal * 0.05;
        let discount = 0;
        
        if (appliedPromo) {
            if (appliedPromo.discount) {
                discount = subtotal * appliedPromo.discount;
                document.getElementById('discount').textContent = `- LKR ${discount.toFixed(2)}`;
            }
            
            if (appliedPromo.deliveryFee !== undefined) {
                deliveryFee = appliedPromo.deliveryFee;
                document.getElementById('delivery-fee').textContent = `LKR ${deliveryFee.toFixed(2)}`;
            }
        }
        
        const total = subtotal + deliveryFee + tax - discount;
        
        localStorage.setItem('thaara-order-total', total.toFixed(2));
        
        document.getElementById('subtotal').textContent = `LKR ${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `LKR ${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `LKR ${total.toFixed(2)}`;
    }

    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('item');
        const title = urlParams.get('title');
        const price = parseFloat(urlParams.get('price'));
        const image = urlParams.get('image');
        
        if (itemId && title && price && image) {
            const existingItem = cartItems.find(item => item.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: itemId,
                    title: title,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            saveCart();
            showCartMessage("Item added to cart!");
        }
    }

    function proceedToDeliveryDetails() {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
        } else {
            const orderSummary = {
                items: cartItems,
                promoCode: appliedPromo,
                total: parseFloat(localStorage.getItem('thaara-order-total'))
            };
            localStorage.setItem('thaara-order-summary', JSON.stringify(orderSummary));
            
            window.location.href = 'Delivery Details Page.html';
        }
    }

    // Initialize
    loadCart();
    handleUrlParams();
    renderCart();
    
    document.getElementById('apply-promo').addEventListener('click', function() {
        const promoCode = document.getElementById('promo-code-input').value.trim().toUpperCase();
        applyPromoCode(promoCode);
    });
    
    document.getElementById('checkout-btn').addEventListener('click', function() {
        proceedToDeliveryDetails();
    });
});

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