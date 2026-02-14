// Initialize all functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const filterToggle = document.querySelector('.filter-toggle');
    const filterPanel = document.getElementById('filterPanel');
    const menuSection = document.querySelector('.menu-section');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const cartCountElement = document.querySelector('.cart-count');
    const backToTopButton = document.getElementById('back-to-top');
    
    // Initialize filter toggle
    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', function(e) {
            e.preventDefault();
            filterToggle.classList.toggle('active');
            
            if (filterPanel.style.display === 'block') {
                filterPanel.style.display = 'none';
                menuSection.classList.remove('shifted');
            } else {
                filterPanel.style.display = 'block';
                menuSection.classList.add('shifted');
            }
        });
    }
    
    // Update cart count on page load
    updateCartCount();
    
    // Load menu items from XML on page load
    loadMenuFromXML();
    
    // Initialize back to top button
    initBackToTop();
    
    // Add event listeners
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Function to update cart count
    function updateCartCount() {
        if (!cartCountElement) return;
        
        const savedCart = localStorage.getItem('thaara-cart');
        let count = 0;
        
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            count = cart.reduce((total, item) => total + item.quantity, 0);
        }
        
        cartCountElement.textContent = count;
    }
    
    // Function to show cart notification
    function showCartNotification(message) {
        const notification = document.querySelector('.cart-notification');
        if (!notification) return;
        
        notification.innerHTML = `<i class="fas fa-check-circle"></i><p>${message}</p>`;
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
    
    // Add to cart function that will be available globally
    window.addToCart = function(id, title, price, image) {
        // First try to get existing cart from localStorage
        let cart = [];
        const savedCart = localStorage.getItem('thaara-cart');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        // Check if item already exists in cart
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
        
        // Save updated cart
        localStorage.setItem('thaara-cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showCartNotification(`Added ${title} to cart!`);
        
        // Add bounce animation to cart icon
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('cart-bounce');
            setTimeout(() => {
                cartIcon.classList.remove('cart-bounce');
            }, 500);
        }
    };
    
    // Function to load menu items from XML
    function loadMenuFromXML() {
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
                displayMenuFromXML(xmlDoc);
            })
            .catch(error => {
                console.error('Error loading XML:', error);
                const menuContainer = document.getElementById('menu-container');
                if (menuContainer) {
                    menuContainer.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Sorry, we couldn't load our menu items. Please try again later.</p>
                        </div>
                    `;
                }
            });
    }
    
    // Function to display menu items from XML
    function displayMenuFromXML(xmlDoc) {
        const menuContainer = document.getElementById('menu-container');
        if (!menuContainer) return;
        
        menuContainer.innerHTML = '';
        
        const categories = xmlDoc.getElementsByTagName('category');
        
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const categoryId = category.getAttribute('id');
            const categoryName = category.getElementsByTagName('n')[0].textContent;
            
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'menu-category';
            categorySection.setAttribute('data-category', categoryId);
            
            // Create category title
            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'section-title';
            categoryTitle.textContent = categoryName;
            categorySection.appendChild(categoryTitle);
            
            // Create menu grid
            const menuGrid = document.createElement('div');
            menuGrid.className = 'menu-grid';
            categorySection.appendChild(menuGrid);
            
            // Get items in this category
            const items = category.getElementsByTagName('item');
            
            // Display each item
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const itemId = item.getAttribute('id');
                const itemType = item.getAttribute('type');
                const itemPrice = item.getAttribute('price');
                const itemTitle = item.getElementsByTagName('title')[0].textContent;
                const itemDescription = item.getElementsByTagName('description')[0].textContent;
                const itemImage = item.getElementsByTagName('image')[0].textContent;
                
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.setAttribute('data-type', itemType);
                menuItem.setAttribute('data-price', itemPrice);
                menuItem.style.setProperty('--animation-order', j);
                
                menuItem.innerHTML = `
                    <div class="item-image-container">
                        <img src="${itemImage}" alt="${itemTitle}" class="item-image">
                        <span class="food-type-indicator ${itemType}"></span>
                    </div>
                    <div class="item-details">
                        <div class="item-title">${itemTitle}</div>
                        <div class="item-description">${itemDescription}</div>
                        <div class="item-price">LKR ${parseFloat(itemPrice).toFixed(2)}</div>
                        <button class="add-to-cart" onclick="addToCart('${itemId}', '${itemTitle.replace(/'/g, "\\'")}', ${itemPrice}, '${itemImage}')">
                            <i class="fas fa-cart-plus"></i> Add to cart
                        </button>
                    </div>
                `;
                
                menuGrid.appendChild(menuItem);
            }
            
            menuContainer.appendChild(categorySection);
        }
    }
    
    // Apply filters function
    function applyFilters() {
        // Get filter values
        const priceFilter = document.querySelector('input[name="price"]:checked').value;
        const typeFilter = document.querySelector('input[name="type"]:checked').value;
        const categoryFilter = document.querySelector('input[name="category"]:checked').value;
        
        // Get all menu items
        const menuItems = document.querySelectorAll('.menu-item');
        
        // Counter for visible items
        let visibleItems = 0;
        
        // Track visible items per category
        const visibleItemsByCategory = {};
        document.querySelectorAll('.menu-category').forEach(category => {
            const categoryId = category.getAttribute('data-category');
            if (categoryId) {
                visibleItemsByCategory[categoryId] = 0;
            }
        });
        
        // Apply filters to each menu item
        menuItems.forEach((item) => {
            const itemPrice = parseFloat(item.getAttribute('data-price'));
            const itemType = item.getAttribute('data-type');
            const categorySection = item.closest('.menu-category');
            const itemCategory = categorySection.getAttribute('data-category');
            
            // Check price filter
            let matchesPrice = true;
            if (priceFilter === 'low') {
                matchesPrice = itemPrice < 400;
            } else if (priceFilter === 'medium') {
                matchesPrice = itemPrice >= 400 && itemPrice <= 700;
            } else if (priceFilter === 'high') {
                matchesPrice = itemPrice > 700;
            }
            
            // Check type filter
            const matchesType = typeFilter === 'all' || itemType === typeFilter;
            
            // Check category filter
            const matchesCategory = categoryFilter === 'all' || itemCategory === categoryFilter;
            
            // Show or hide item based on filters
            if (matchesPrice && matchesType && matchesCategory) {
                item.style.display = 'flex';
                visibleItems++;
                
                if (itemCategory) {
                    visibleItemsByCategory[itemCategory]++;
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide category sections based on visible items
        document.querySelectorAll('.menu-category').forEach(category => {
            const categoryId = category.getAttribute('data-category');
            
            if (visibleItemsByCategory[categoryId] === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
        
        // Show no results message if needed
        const noResultsMessage = document.getElementById('no-results');
        if (noResultsMessage) {
            if (visibleItems === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        }
    }
    
    // Reset filters function
    function resetFilters() {
        document.getElementById('price-all').checked = true;
        document.getElementById('type-all').checked = true;
        document.getElementById('category-all').checked = true;
        
        applyFilters();
    }
    
    // Back to top button functionality
    function initBackToTop() {
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
});