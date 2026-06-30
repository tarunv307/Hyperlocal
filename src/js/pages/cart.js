// ═══════════════════════════════════════════════════════════
// Cart Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../app.js';

export function renderCart() {
  const cart = appState.get('cart');
  const subtotal = appState.getCartTotal();
  const savings = appState.getCartSavings();
  const deliveryCharge = subtotal >= CONFIG.FREE_DELIVERY_ABOVE ? 0 : CONFIG.DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge + CONFIG.PLATFORM_FEE;

  if (cart.length === 0) {
    return `
      <div id="cart-page">
        <div class="app-header">
          <button class="header-back-btn" onclick="window.history.back()">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <h4 class="app-header-title">Shopping Cart</h4>
        </div>
        <div class="empty-state">
          <span class="material-icons-round empty-state-icon" style="font-size:80px;">shopping_cart</span>
          <h4 class="empty-state-title">Your cart is empty</h4>
          <p class="empty-state-text">Looks like you haven't added anything to your cart yet</p>
          <button class="btn btn-primary btn-pill" onclick="window.location.hash='/home'">
            <span class="material-icons-round">storefront</span>
            Start Shopping
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div id="cart-page" class="cart-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Shopping Cart (${appState.getCartCount()})</h4>
        <button class="btn-ghost" style="font-size:var(--fs-sm);color:var(--error);font-weight:600;" 
                onclick="window.clearCartConfirm()">Clear</button>
      </div>

      <!-- Delivery Time Banner -->
      <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--primary-lighter);margin:0;">
        <span class="material-icons-round" style="color:var(--primary);">schedule</span>
        <span style="font-size:var(--fs-sm);font-weight:500;color:var(--primary-dark);">
          Delivery in ${CONFIG.ESTIMATED_DELIVERY_MINS}-15 minutes
        </span>
      </div>

      <!-- Cart Items -->
      <div id="cart-items">
        ${cart.map(item => `
          <div class="cart-item" id="cart-item-${item.id}">
            <div class="cart-item-image">
              ${item.image && item.image.startsWith('http') 
                ? `<img src="${item.image}" alt="${item.name}" />`
                : `<span>${item.image || '📦'}</span>`}
            </div>
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-weight">${item.weight || ''}</div>
              <div class="cart-item-bottom">
                <span class="cart-item-price">${CONFIG.CURRENCY}${item.price * item.quantity}</span>
                <div class="qty-control">
                  <button class="qty-btn" onclick="window.cartUpdateQty('${item.id}', ${item.quantity - 1})">−</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.cartUpdateQty('${item.id}', ${item.quantity + 1})">+</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Promo Code -->
      <div class="promo-input">
        <input type="text" id="promo-code" placeholder="Enter promo code" />
        <button class="btn btn-primary btn-sm" onclick="window.applyPromo()">APPLY</button>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <div class="cart-summary-title">Price Details</div>
        <div class="cart-summary-row">
          <span>Subtotal</span>
          <span>${CONFIG.CURRENCY}${subtotal}</span>
        </div>
        <div class="cart-summary-row">
          <span>Delivery Fee</span>
          <span style="color:${deliveryCharge === 0 ? 'var(--success)' : 'inherit'}">
            ${deliveryCharge === 0 ? 'FREE' : CONFIG.CURRENCY + deliveryCharge}
          </span>
        </div>
        <div class="cart-summary-row">
          <span>Platform Fee</span>
          <span>${CONFIG.CURRENCY}${CONFIG.PLATFORM_FEE}</span>
        </div>
        ${savings > 0 ? `
          <div class="cart-summary-row" style="color:var(--success);">
            <span>You Save</span>
            <span>-${CONFIG.CURRENCY}${savings}</span>
          </div>
        ` : ''}
        <div class="cart-summary-total">
          <span>Total Amount</span>
          <span>${CONFIG.CURRENCY}${total}</span>
        </div>
        ${savings > 0 ? `
          <div class="cart-summary-savings">
            🎉 You're saving ${CONFIG.CURRENCY}${savings} on this order!
          </div>
        ` : ''}
      </div>

      <!-- Checkout Bar -->
      <div class="cart-checkout-bar">
        <button class="btn btn-primary btn-full btn-lg btn-pill" onclick="window.location.hash='/checkout'">
          Proceed to Checkout — ${CONFIG.CURRENCY}${total}
        </button>
      </div>
    </div>
  `;
}

export function initCart() {
  window.cartUpdateQty = function(productId, qty) {
    appState.updateCartQuantity(productId, qty);
    // Re-render cart page
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = renderCart();
      initCart();
    }
  };

  window.clearCartConfirm = function() {
    if (confirm('Remove all items from cart?')) {
      appState.clearCart();
      const container = document.getElementById('page-container');
      if (container) {
        container.innerHTML = renderCart();
      }
      showToast('Cart cleared', 'info');
    }
  };

  window.applyPromo = function() {
    const code = document.getElementById('promo-code')?.value.trim().toUpperCase();
    if (!code) { showToast('Enter a promo code', 'error'); return; }
    const promo = CONFIG.DEMO_OFFERS.find(o => o.code === code);
    if (promo) {
      showToast(`Promo "${code}" applied! ${promo.discount}`, 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };
}
