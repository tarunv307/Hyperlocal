// ═══════════════════════════════════════════════════════════
// Admin - Manage Products
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../../config.js';

export function renderAdminProducts() {
  const products = CONFIG.DEMO_PRODUCTS;
  return `
    <div id="admin-products" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Manage Products</h4>
        <button class="btn btn-primary btn-sm btn-pill">+ Add</button>
      </div>
      <div style="padding:12px 16px;">
        <div class="search-bar">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Search products..." />
        </div>
      </div>
      <div class="admin-table-wrapper" style="margin-top:0;">
        <div class="admin-table-header">
          <span class="admin-table-title">Products (${products.length})</span>
        </div>
        ${products.map(p => `
          <div class="admin-table-row" style="padding:12px 20px;">
            <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${p.image || '📦'}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:var(--fs-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">${p.weight} · ${p.category}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700;font-size:var(--fs-sm);">₹${p.price}</div>
              <span class="badge ${p.inStock ? 'badge-success' : 'badge-error'}" style="font-size:9px;">${p.inStock ? 'In Stock' : 'Out'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
export function initAdminProducts() {}
