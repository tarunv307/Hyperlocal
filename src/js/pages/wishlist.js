// ═══════════════════════════════════════════════════════════
// Wishlist Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { renderProductCard } from '../components/product-card.js';

export function renderWishlist() {
  const wishlistIds = appState.get('wishlist') || [];
  const products = CONFIG.DEMO_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  return `
    <div id="wishlist-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">My Wishlist (${products.length})</h4>
      </div>
      ${products.length === 0 ? `
        <div class="empty-state">
          <span class="material-icons-round empty-state-icon">favorite_border</span>
          <h4 class="empty-state-title">Wishlist is empty</h4>
          <p class="empty-state-text">Save items you love by tapping the heart icon</p>
          <button class="btn btn-primary btn-pill" onclick="window.location.hash='/home'">Browse Products</button>
        </div>
      ` : `
        <div class="product-grid" style="padding:16px;padding-bottom:100px;">
          ${products.map(p => renderProductCard(p)).join('')}
        </div>
      `}
    </div>
  `;
}

export function initWishlist() {}
