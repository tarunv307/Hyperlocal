// ═══════════════════════════════════════════════════════════
// Store Detail Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { renderProductCard } from '../components/product-card.js';

export function renderStore(params = {}) {
  const storeId = params.id || 's1';
  const store = CONFIG.DEMO_STORES.find(s => s.id === storeId) || CONFIG.DEMO_STORES[0];
  const products = CONFIG.DEMO_PRODUCTS.filter(p => p.storeId === storeId);
  const categories = [...new Set(products.map(p => p.category))];

  return `
    <div id="store-page">
      <!-- Header Image -->
      <div style="position:relative;height:200px;overflow:hidden;">
        <img src="${store.image}" alt="${store.name}" 
             style="width:100%;height:100%;object-fit:cover;"
             onerror="this.style.display='none'" />
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.7));"></div>
        <button class="header-back-btn" style="position:absolute;top:12px;left:12px;background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);color:white;" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <div style="position:absolute;bottom:16px;left:16px;right:16px;color:white;">
          <h2 style="font-size:var(--fs-xl);font-weight:var(--fw-bold);color:white;">${store.name}</h2>
          <div style="display:flex;align-items:center;gap:12px;margin-top:6px;font-size:var(--fs-sm);opacity:0.9;">
            <span style="display:flex;align-items:center;gap:4px;">
              <span class="material-icons-round" style="font-size:14px;color:#FFD700;">star</span> ${store.rating}
            </span>
            <span>•</span>
            <span>${store.deliveryTime}</span>
            <span>•</span>
            <span>${store.distance}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Info -->
      <div style="display:flex;gap:16px;padding:16px;background:var(--accent);margin:0;">
        <div style="flex:1;display:flex;align-items:center;gap:8px;">
          <span class="material-icons-round" style="color:var(--primary);font-size:20px;">delivery_dining</span>
          <div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Delivery Fee</div>
            <div style="font-size:var(--fs-sm);font-weight:600;">${CONFIG.CURRENCY}${CONFIG.DELIVERY_CHARGE}</div>
          </div>
        </div>
        <div style="width:1px;background:var(--border);"></div>
        <div style="flex:1;display:flex;align-items:center;gap:8px;">
          <span class="material-icons-round" style="color:var(--primary);font-size:20px;">schedule</span>
          <div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Delivery Time</div>
            <div style="font-size:var(--fs-sm);font-weight:600;">${store.deliveryTime}</div>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="tabs" style="padding:0 16px;">
        <button class="tab active" onclick="window.filterStoreCategory(null, this)">All</button>
        ${categories.map(cat => {
          const catInfo = CONFIG.CATEGORIES.find(c => c.id === cat);
          return `<button class="tab" onclick="window.filterStoreCategory('${cat}', this)">
            ${catInfo ? catInfo.icon + ' ' : ''}${catInfo ? catInfo.name : cat}
          </button>`;
        }).join('')}
      </div>

      <!-- Products Grid -->
      <div class="product-grid" id="store-products" style="padding:16px;padding-bottom:100px;">
        ${products.map(p => renderProductCard(p)).join('')}
      </div>
    </div>

    ${renderFloatingCartBar()}
  `;
}

export function initStore(params = {}) {
  const storeId = params.id || 's1';

  window.filterStoreCategory = function(category, btn) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const products = CONFIG.DEMO_PRODUCTS.filter(p => {
      if (p.storeId !== storeId) return false;
      if (category) return p.category === category;
      return true;
    });

    const grid = document.getElementById('store-products');
    if (grid) {
      grid.innerHTML = products.map(p => renderProductCard(p)).join('');
    }
  };

  updateFloatingCart();
  appState.on('cart', () => updateFloatingCart());
}

function renderFloatingCartBar() {
  const count = appState.getCartCount();
  if (count === 0) return '';
  const total = appState.getCartTotal();
  return `
    <div class="floating-cart-bar" onclick="window.location.hash='/cart'">
      <div class="floating-cart-info">
        <span class="floating-cart-items">${count} item${count > 1 ? 's' : ''}</span>
        <span class="floating-cart-total">${CONFIG.CURRENCY}${total} plus taxes</span>
      </div>
      <div class="floating-cart-btn">
        View Cart <span class="material-icons-round" style="font-size:18px;">arrow_forward</span>
      </div>
    </div>
  `;
}

function updateFloatingCart() {
  const existing = document.querySelector('.floating-cart-bar');
  const count = appState.getCartCount();
  if (count > 0) {
    const html = renderFloatingCartBar();
    if (existing) {
      existing.outerHTML = html;
    } else {
      document.getElementById('store-page')?.insertAdjacentHTML('afterend', html);
    }
  } else if (existing) {
    existing.remove();
  }
}
