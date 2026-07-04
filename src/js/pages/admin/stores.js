// ═══════════════════════════════════════════════════════════
// Admin - Manage Stores
// ═══════════════════════════════════════════════════════════

import { appState } from '../../state.js';
import { insertData } from '../../supabase.js';

export function renderAdminStores() {
  const stores = appState.get('stores');
  return `
    <div id="admin-stores" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Manage Stores</h4>
        <button class="btn btn-primary btn-sm btn-pill" onclick="document.getElementById('add-store-modal').classList.remove('hidden')">+ Add</button>
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
      </div>
    </div>

    <!-- Add Store Modal -->
    <div id="add-store-modal" class="modal-overlay hidden" style="z-index:100;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;">
      <div style="background:var(--surface);width:90%;max-width:400px;border-radius:var(--radius-xl);padding:24px;">
        <h3 style="margin-bottom:16px;">Add New Store</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input type="text" id="new-s-name" placeholder="Store Name" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-s-tags" placeholder="Tags (comma separated)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-s-time" placeholder="Delivery Time (e.g. 10-15 min)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-s-dist" placeholder="Distance (e.g. 1.2 km)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-s-image" placeholder="Image URL (optional)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          
          <div style="display:flex;gap:12px;margin-top:12px;">
            <button class="btn btn-outline" style="flex:1;" onclick="document.getElementById('add-store-modal').classList.add('hidden')">Cancel</button>
            <button class="btn btn-primary" style="flex:1;" onclick="window.submitNewStore()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminStores() {
  window.submitNewStore = async function() {
    const name = document.getElementById('new-s-name').value;
    const tags = document.getElementById('new-s-tags').value;
    const time = document.getElementById('new-s-time').value;
    const dist = document.getElementById('new-s-dist').value;
    const image = document.getElementById('new-s-image').value;

    if (!name) {
      import('../../app.js').then(app => app.showToast('Store name is required', 'error'));
      return;
    }

    const newStore = {
      id: 'S-' + Date.now().toString(36).toUpperCase(),
      name,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      delivery_time: time || '10-15 min',
      distance: dist || '1.0 km',
      rating: 4.5,
      image: image || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=200&fit=crop',
      is_open: true,
      discount: '10% OFF'
    };

    const { error } = await insertData('stores', newStore);
    if (error) {
      import('../../app.js').then(app => app.showToast('Failed to save to database', 'error'));
      return;
    }

    const currentStores = appState.get('stores') || [];
    appState.set('stores', [newStore, ...currentStores]);
    
    import('../../app.js').then(app => app.showToast('Store added successfully!', 'success'));
    document.getElementById('add-store-modal').classList.add('hidden');
    import('../../router.js').then(m => m.router.handleRoute()); // re-render
  };
}
