// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initSlideshow();
    initReviewSlider();
    loadOffersAndPromotions();
    initBackToTop();
});

// Slideshow functionality
function initSlideshow() {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slideshow .slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevButton = document.querySelector('.arrow.prev');
    const nextButton = document.querySelector('.arrow.next');
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slideIndex = (n + slides.length) % slides.length;
        
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }
    
    // Auto slide functionality
    let slideInterval = setInterval(() => showSlide(slideIndex + 1), 5000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => showSlide(slideIndex + 1), 5000);
    }
    
    prevButton.addEventListener('click', function() {
        showSlide(slideIndex - 1);
        resetInterval();
    });
    
    nextButton.addEventListener('click', function() {
        showSlide(slideIndex + 1);
        resetInterval();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetInterval();
        });
    });
    
    showSlide(slideIndex);
}

// Review slider
function initReviewSlider() {
    const reviewSlider = document.querySelector('.review-slider');
    const reviewPrev = document.querySelector('.review-prev');
    const reviewNext = document.querySelector('.review-next');
    
    const reviewBox = reviewSlider.querySelector('.review-box');
    const reviewStyle = window.getComputedStyle(reviewBox);
    const reviewWidth = reviewBox.offsetWidth + parseInt(reviewStyle.marginRight || 0);
    
    reviewNext.addEventListener('click', function() {
        reviewSlider.scrollBy({ left: reviewWidth, behavior: 'smooth' });
    });
    
    reviewPrev.addEventListener('click', function() {
        reviewSlider.scrollBy({ left: -reviewWidth, behavior: 'smooth' });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
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

// Update cart counter from localStorage
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    
    const savedCart = localStorage.getItem('thaara-cart');
    const count = savedCart 
        ? JSON.parse(savedCart).reduce((total, item) => total + item.quantity, 0)
        : 0;
    
    cartCountElement.textContent = count;
}

// Load offers and promotions
function loadOffersAndPromotions() {
    const offerContainer = document.getElementById('special-offers-container');
    const promotionContainer = document.getElementById('promotions-container');
    
    fetch('thaara-data.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, 'application/xml');
            
            displayOffers(xmlDoc, "special-offers", "special-offers-container");
            displayOffers(xmlDoc, "promotions", "promotions-container");
        })
        .catch(error => {
            console.error('Error loading offers:', error);
            
            if (offerContainer) {
                offerContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Sorry, we couldn't load our special offers. Please try again later.</p>
                    </div>
                `;
            }
            if (promotionContainer) {
                promotionContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Sorry, we couldn't load our promotions. Please try again later.</p>
                    </div>
                `;
            }
        });
}

// Display offers and promotions
function displayOffers(xmlDoc, offerType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const offers = xmlDoc.getElementsByTagName(offerType === "special-offers" ? "offer" : "promotion");
    
    if (offers.length === 0) {
        container.innerHTML = `
            <div class="no-offers-message">
                <p>No ${offerType.replace('-', ' ')} available at the moment. Please check back soon!</p>
            </div>
        `;
        return;
    }
    
    for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        const id = offer.getAttribute("id");
        const title = offer.getElementsByTagName("title")[0]?.textContent || 'Untitled Offer';
        const details = offer.getElementsByTagName("details")[0]?.textContent || 'No details available';
        const price = offer.getElementsByTagName("price")[0]?.textContent || '0';
        const image = offer.getElementsByTagName("img")[0]?.textContent || 'images/placeholder.jpg';
        
        const offerBox = document.createElement("div");
        offerBox.className = "selection-box";
        
        offerBox.innerHTML = `
            <div class="${offerType === 'special-offers' ? 'offer-selection' : 'promotion-selections'}">
                <h3>${title}</h3>
                <div class="offer-image-container">
                    <img src="${image}" alt="${title}" loading="lazy">
                </div>
                <p>${details}</p>
                <p><strong>LKR ${price}</strong></p>
                <button class="add-to-cart" 
                        onclick="addToCartWithAnimation('${id}', '${title.replace(/'/g, "\\'")}', ${price}, '${image}')">
                    <i class="fas fa-cart-plus"></i> Add to cart
                </button>
            </div>
        `;
        
        container.appendChild(offerBox);
    }
}

// Add to cart with animation
function addToCartWithAnimation(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem('thaara-cart')) || [];
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            image: image,
            quantity: 1,
            dateAdded: new Date().toISOString()
        });
    }
    
    localStorage.setItem('thaara-cart', JSON.stringify(cart));
    updateCartCount();
    
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('cart-bounce');
    setTimeout(() => {
        cartIcon.classList.remove('cart-bounce');
    }, 500);

    showCartMessage(`Added ${title} to cart!`);
}
// Show cart message
function showCartMessage(message, isSuccess = true) {
    const messageEl = document.getElementById('cart-message');
    
    if (isSuccess) {
        messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        messageEl.className = '';
    } else {
        messageEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        messageEl.className = 'error';
    }
    
    messageEl.classList.add('visible');
    
    setTimeout(() => {
        messageEl.classList.remove('visible');
    }, 3000);
}

// Make functions available globally
window.addToCartWithAnimation = addToCartWithAnimation;
window.showCartMessage = showCartMessage;