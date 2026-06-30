// ═══════════════════════════════════════════════════════════
// Admin - Manage Stores
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../../config.js';

export function renderAdminStores() {
  const stores = CONFIG.DEMO_STORES;
  return `
    <div id="admin-stores" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Manage Stores</h4>
        <button class="btn btn-primary btn-sm btn-pill">+ Add</button>
      </div>
      <div class="admin-table-wrapper" style="margin-top:8px;">
        ${stores.map(store => `
          <div class="admin-table-row" style="padding:12px 20px;">
            <div style="width:48px;height:48px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;background:var(--accent);">
              <img src="${store.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='🏪'" />
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:var(--fs-sm);">${store.name}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);display:flex;align-items:center;gap:6px;">
                <span class="material-icons-round" style="font-size:12px;color:#FFD700;">star</span>
                ${store.rating} · ${store.distance}
              </div>
            </div>
            <span class="badge ${store.isOpen ? 'badge-success' : 'badge-error'}">${store.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
export function initAdminStores() {}
