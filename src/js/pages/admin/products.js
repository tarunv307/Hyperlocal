// ═══════════════════════════════════════════════════════════
// Admin - Manage Products
// ═══════════════════════════════════════════════════════════

import { appState } from '../../state.js';
import { insertData } from '../../supabase.js';

export function renderAdminProducts() {
  const products = appState.get('products');
  return `
    <div id="admin-products" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Manage Products</h4>
        <button class="btn btn-primary btn-sm btn-pill" onclick="document.getElementById('add-product-modal').classList.remove('hidden')">+ Add</button>
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
    
    <!-- Add Product Modal -->
    <div id="add-product-modal" class="modal-overlay hidden" style="z-index:100;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;right:0;bottom:0;">
      <div style="background:var(--surface);width:90%;max-width:400px;border-radius:var(--radius-xl);padding:24px;">
        <h3 style="margin-bottom:16px;">Add New Product</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input type="text" id="new-p-name" placeholder="Product Name" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-p-price" placeholder="Price (₹)" type="number" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-p-category" placeholder="Category (e.g. groceries)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-p-weight" placeholder="Weight/Quantity (e.g. 1 kg)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          <input type="text" id="new-p-image" placeholder="Image URL or Emoji (e.g. 🍎)" class="search-bar" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--border);border-radius:8px;">
          
          <div style="display:flex;gap:12px;margin-top:12px;">
            <button class="btn btn-outline" style="flex:1;" onclick="document.getElementById('add-product-modal').classList.add('hidden')">Cancel</button>
            <button class="btn btn-primary" style="flex:1;" onclick="window.submitNewProduct()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminProducts() {
  window.submitNewProduct = async function() {
    const name = document.getElementById('new-p-name').value;
    const price = document.getElementById('new-p-price').value;
    const category = document.getElementById('new-p-category').value;
    const weight = document.getElementById('new-p-weight').value;
    const image = document.getElementById('new-p-image').value;

    if (!name || !price || !category) {
      import('../../app.js').then(app => app.showToast('Name, price and category required', 'error'));
      return;
    }

    const newProduct = {
      id: 'P-' + Date.now().toString(36).toUpperCase(),
      store_id: 's1', // Defaulting to s1 for demo
      category,
      name,
      weight: weight || '1 item',
      price: parseFloat(price),
      original_price: parseFloat(price) + 10,
      discount: 0,
      image: image || '📦',
      in_stock: true
    };

    const { error } = await insertData('products', newProduct);
    if (error) {
      import('../../app.js').then(app => app.showToast('Failed to save to database', 'error'));
      return;
    }

    const currentProducts = appState.get('products') || [];
    appState.set('products', [newProduct, ...currentProducts]);
    
    import('../../app.js').then(app => app.showToast('Product added successfully!', 'success'));
    document.getElementById('add-product-modal').classList.add('hidden');
    import('../../router.js').then(m => m.router.handleRoute()); // re-render
  };
}
