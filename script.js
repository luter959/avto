// Data for products
const products = [
    {
        id: 1,
        name: "Масляный фильтр",
        category: "engine",
        price: 1250,
        image: "https://avatars.mds.yandex.net/i?id=ae52bece7ba4e8038ca9e35a84f3dfd4_l-3923094-images-thumbs&n=13",
        description: "Высококачественный фильтр для всех типов двигателей"
    },
    {
        id: 2,
        name: "Тормозные колодки",
        category: "suspension",
        price: 3800,
        image: "https://avatars.mds.yandex.net/i?id=f285e2a2bc788757e3d7d53c9d548062_l-9671619-images-thumbs&n=13",
        description: "Передние тормозные колодки, комплект"
    },
    {
        id: 3,
        name: "Аккумулятор 60Ач",
        category: "electrical",
        price: 5600,
        image: "https://vinylrussia.ru/upload/iex_resize_cache/iblock/60e/fancy_992_60ee0b4594e2676b3873d4d3e0f824f2.jpg",
        description: "Свинцово-кислотный аккумулятор 12В"
    },
    {
        id: 4,
        name: "Свечи зажигания",
        category: "engine",
        price: 2400,
        image: "https://a.d-cd.net/a07a995s-960.jpg",
        description: "Иридиевые свечи зажигания, комплект 4 шт"
    },
    {
        id: 5,
        name: "Ремень ГРМ",
        category: "engine",
        price: 3200,
        image: "https://cdn1.ozone.ru/s3/multimedia-8/6289345292.jpg",
        description: "Ремень газораспределительного механизма"
    },
    {
        id: 6,
        name: "Сцепление",
        category: "transmission",
        price: 8900,
        image: "https://media.au.ru/imgs/45fd3aa600ce44944fb58f368898272c/",
        description: "Комплект сцепления с выжимным подшипником"
    },
    {
        id: 7,
        name: "Амортизаторы",
        category: "suspension",
        price: 4200,
        image: "https://kopterfly.ru/image/cache/catalog/73702/51c55d9b66913e92e0ce51a47d2ef5b5-800x800.jpg",
        description: "Передние амортизаторы, пара"
    },
    {
        id: 8,
        name: "Генератор",
        category: "electrical",
        price: 7200,
        image: "https://st43.stpulscen.ru/images/product/485/199/662_big.jpg",
        description: "Генератор переменного тока 12V 90A"
    }
];

// Cart functionality
let cart = [];
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsContainer = document.getElementById('productsContainer');
const filterOptions = document.querySelectorAll('.filter-option');
const categoryCards = document.querySelectorAll('.category-card');
const searchInput = document.getElementById('searchInput');

// Initialize the site
function init() {
    renderProducts(products);
    loadCartFromStorage();
    updateCartUI();
    setupEventListeners();
}

// Render products to the page
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    
    // Show notification
    showNotification(`Товар "${product.name}" добавлен в корзину!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

// Update cart quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        cartTotal.textContent = 'Итого: 0 ₽';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} ₽ x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateQuantity(id, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeFromCart(id);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Search products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Заказ успешно оформлен! Спасибо за покупку!');
            cart = [];
            updateCartUI();
            saveCartToStorage();
            cartModal.style.display = 'none';
        } else {
            alert('Корзина пуста!');
        }
    });
    
    // Filter options
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            filterOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            // Filter products
            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            // Update filter options
            filterOptions.forEach(opt => opt.classList.remove('active'));
            document.querySelector(`.filter-option[data-filter="${category}"]`).classList.add('active');
            // Filter products
            filterProducts(category);
        });
    });
    
    // Search input
    searchInput.addEventListener('input', function() {
        const query = this.value;
        if (query.length >= 2 || query.length === 0) {
            searchProducts(query);
        }
    });
}

// Initialize the site when DOM is loaded
document.addEventListener('DOMContentLoaded', init);