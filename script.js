/* ====== MOCK DATABASE ====== */
const products = [
    // Electronics
    { id: 101, name: "Noise-Cancelling Wireless Headphones", price: 299.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", originalPrice: 349.99 },
    { id: 102, name: "Smart Watch Series X", price: 399.00, category: "Electronics", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 103, name: "Pro Vision 4K Camera", price: 899.50, category: "Electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", originalPrice: 999.00 },
    { id: 104, name: "Minimalist Mechanical Keyboard", price: 129.99, category: "Electronics", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

    // Clothing
    { id: 201, name: "Classic Denim Jacket", price: 89.99, category: "Clothing", image: "https://images.unsplash.com/photo-1551028719-01c1eb562251?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 202, name: "Essential Cotton T-Shirt", price: 24.50, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 203, name: "Urban Comfort Sneakers", price: 119.00, category: "Clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", originalPrice: 149.00 },
    { id: 204, name: "Minimalist Leather Backpack", price: 159.00, category: "Clothing", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

    // Essentials
    { id: 301, name: "Organic Skincare Set", price: 45.00, category: "Essentials", image: "https://images.unsplash.com/photo-1615397123771-87a2459b15b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 302, name: "Premium Coffee Beans (1kg)", price: 28.99, category: "Essentials", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 303, name: "Aromatherapy Candle", price: 18.50, category: "Essentials", image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 304, name: "Bamboo Toothbrush (Pack of 4)", price: 12.00, category: "Essentials", image: "https://images.unsplash.com/photo-1600181516264-3ea80749021b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
];

/* ====== STATE ====== */
let cart = [];

/* ====== INITIALIZATION ====== */
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts(products);
    setupSearch();
});

/* ====== UI NAVIGATION ====== */
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(viewId === 'checkout') {
        renderCheckoutSummary();
        closeCart(); // close sidebar if open
    }
}

function toggleMobileMenu() {
    document.getElementById('mobile-nav').classList.toggle('open');
}

/* ====== PRODUCT RENDERING ====== */
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found.</p>';
        return;
    }

    items.forEach((item, index) => {
        const delay = index * 0.05;
        const discountHTML = item.originalPrice ? `<span class="orig-price">$${item.originalPrice.toFixed(2)}</span>` : '';
        
        const card = `
            <div class="product-card" style="animation: fadeIn 0.4s ease ${delay}s both;">
                <div class="product-img-wrap">
                    <span class="product-category">${item.category}</span>
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${item.name}</h3>
                    <div class="product-price">
                        $${item.price.toFixed(2)}
                        ${discountHTML}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline w-100" onclick="addToCart(${item.id})">
                            <ion-icon name="cart-outline"></ion-icon> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', card);
    });
}

function filterCategory(category, btnElement) {
    // Update active state
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Find all buttons that match this category text to sync desktop & mobile
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if(btn.textContent === category) btn.classList.add('active');
    });

    document.getElementById('current-category-title').textContent = category === 'All' ? 'Featured Products' : `${category}`;
    
    if (category === 'All') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
    
    // Close mobile nav implicitly
    document.getElementById('mobile-nav').classList.remove('open');
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        if(!query) {
            renderProducts(products);
            document.getElementById('current-category-title').textContent = 'Featured Products';
            return;
        }
        
        const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        document.getElementById('current-category-title').textContent = `Search results for "${query}"`;
        renderProducts(filtered);
    };

    searchInput.addEventListener('input', handleSearch);
    if(mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearch);
}

/* ====== CART LOGIC ====== */
function toggleCart() {
    const sidebar = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeCart() {
    document.getElementById('cart-panel').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('nexbuy_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('nexbuy_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch(e) { cart = []; }
    }
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/* ====== CART UI ====== */
function updateCartUI() {
    // Update Badges
    const count = getCartItemCount();
    document.getElementById('cart-badge').textContent = count;
    
    // Disable/Enable Checkout Button
    const btnCheckout = document.getElementById('btn-to-checkout');
    btnCheckout.disabled = count === 0;

    // Render Side Cart
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-sidebar-total');
    
    totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function goToCheckout() {
    showView('checkout');
}

/* ====== CHECKOUT ====== */
function renderCheckoutSummary() {
    const list = document.getElementById('checkout-items');
    list.innerHTML = '';
    
    cart.forEach(item => {
        list.insertAdjacentHTML('beforeend', `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
                <div class="checkout-item-details">
                    <div style="font-weight: 500;">${item.name}</div>
                    <div style="color: var(--text-muted); font-size: 0.85rem;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                </div>
                <div style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `);
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 5.00 : 0.00; // Flat shipping if cart > 0
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    document.getElementById('co-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('co-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('co-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('co-total').textContent = `$${grandTotal.toFixed(2)}`;
}

// Payment Select highlighting
function selectPayment(element) {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('border-active'));
    element.classList.add('border-active');
}

// Process Order
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.checkout-submit-btn');
    submitBtn.innerHTML = '<ion-icon name="reload-outline" class="spin"></ion-icon> Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        
        // Reset form
        e.target.reset();
        submitBtn.innerHTML = 'Pay Now';
        submitBtn.disabled = false;
        
        showView('success');
    }, 1500);
});
