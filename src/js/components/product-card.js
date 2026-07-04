// ═══════════════════════════════════════════════════════════
// Product Card Component
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { CONFIG } from '../config.js';

export function renderProductCard(product) {
  const cartItem = appState.getCartItem(product.id);
  const isWishlisted = appState.isInWishlist(product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return `
    <div class="product-card" id="product-card-${product.id}">
      <div class="product-card-image">
        ${product.image && product.image.startsWith('http') 
          ? `<img src="${product.image}" alt="${product.name}" loading="lazy" 
                  onerror="this.style.display='none';this.parentElement.textContent='${product.image}'" />`
          : `<span style="font-size:140px;">${product.image || '📦'}</span>`
        }
        <div class="product-card-wishlist ${isWishlisted ? 'active' : ''}" 
             onclick="event.stopPropagation();window.toggleWishlist('${product.id}')">
          <span class="material-icons-round">${isWishlisted ? 'favorite' : 'favorite_border'}</span>
        </div>
        ${product.discount ? `<div class="product-card-discount"><span class="discount-badge">${product.discount}% OFF</span></div>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-weight">${product.weight || ''}</div>
        <div class="product-card-price-row">
          <div class="product-card-price">
            <span class="product-price-current">${CONFIG.CURRENCY}${product.price}</span>
            ${product.originalPrice && product.originalPrice > product.price 
              ? `<span class="product-price-original">${CONFIG.CURRENCY}${product.originalPrice}</span>` 
              : ''}
          </div>
          ${qty > 0 
            ? `<div class="qty-control" id="qty-${product.id}">
                <button class="qty-btn" onclick="event.stopPropagation();window.updateQty('${product.id}', ${qty - 1})">−</button>
                <span class="qty-value">${qty}</span>
                <button class="qty-btn" onclick="event.stopPropagation();window.updateQty('${product.id}', ${qty + 1})">+</button>
              </div>`
            : `<button class="add-to-cart-btn" onclick="event.stopPropagation();window.addToCart('${product.id}')">ADD</button>`
          }
        </div>
        <div class="product-card-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
          ${product.inStock ? '● In Stock' : '● Out of Stock'}
        </div>
      </div>
    </div>
  `;
}

// Global functions for cart and wishlist
window.addToCart = function(productId) {
  const product = CONFIG.DEMO_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  appState.addToCart(product);
  refreshProductCard(productId);
  showCartAnimation(productId);
};

window.updateQty = function(productId, qty) {
  appState.updateCartQuantity(productId, qty);
  refreshProductCard(productId);
};

window.toggleWishlist = function(productId) {
  appState.toggleWishlist(productId);
  const el = document.querySelector(`#product-card-${productId} .product-card-wishlist`);
  if (el) {
    const icon = el.querySelector('.material-icons-round');
    const isNowWishlisted = appState.isInWishlist(productId);
    el.classList.toggle('active', isNowWishlisted);
    icon.textContent = isNowWishlisted ? 'favorite' : 'favorite_border';
    if (isNowWishlisted) {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = 'cartBounce 0.4s var(--ease-bounce)';
    }
  }
};

function refreshProductCard(productId) {
  const product = CONFIG.DEMO_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const card = document.getElementById(`product-card-${productId}`);
  if (card) {
    const newCard = document.createElement('div');
    newCard.innerHTML = renderProductCard(product);
    card.replaceWith(newCard.firstElementChild);
  }
}

function showCartAnimation(productId) {
  const card = document.getElementById(`product-card-${productId}`);
  if (card) {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'pulse 0.3s var(--ease-smooth)';
  }
}
