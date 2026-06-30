// ═══════════════════════════════════════════════════════════
// Search Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { renderProductCard } from '../components/product-card.js';

export function renderSearch(params = {}) {
  const categories = CONFIG.CATEGORIES;
  const activeCategory = params.category || null;

  return `
    <div id="search-page">
      <div class="search-page-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <input type="text" class="search-full-input" id="search-input" 
               placeholder="Search products, stores..." autofocus 
               value="${appState.get('searchQuery') || ''}" />
      </div>

      <!-- Category Chips -->
      <div class="h-scroll" style="padding:0 16px 16px;gap:8px;">
        <button class="chip ${!activeCategory ? 'active' : ''}" onclick="window.filterCategory(null)">All</button>
        ${categories.map(cat => `
          <button class="chip ${activeCategory === cat.id ? 'active' : ''}" 
                  onclick="window.filterCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
          </button>
        `).join('')}
      </div>

      <!-- Results -->
      <div id="search-results" class="product-grid" style="padding-bottom:100px;">
      </div>

      <!-- Empty State -->
      <div id="search-empty" class="empty-state hidden">
        <span class="material-icons-round empty-state-icon">search_off</span>
        <h4 class="empty-state-title">No products found</h4>
        <p class="empty-state-text">Try searching with different keywords or browse categories</p>
      </div>
    </div>
  `;
}

export function initSearch(params = {}) {
  const input = document.getElementById('search-input');
  const activeCategory = params.category || null;
  
  // Initial render
  filterAndRender(input?.value || '', activeCategory);

  // Search input handler
  if (input) {
    let timeout;
    input.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        appState.set('searchQuery', e.target.value);
        const currentCat = document.querySelector('.chip.active')?.textContent?.trim();
        const catId = CONFIG.CATEGORIES.find(c => currentCat?.includes(c.name))?.id || null;
        filterAndRender(e.target.value, catId === 'All' ? null : catId);
      }, 300);
    });
  }

  // Global filter function
  window.filterCategory = function(categoryId) {
    // Update chips
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (categoryId) {
      const chip = [...document.querySelectorAll('.chip')].find(c => c.getAttribute('onclick')?.includes(categoryId));
      if (chip) chip.classList.add('active');
    } else {
      document.querySelector('.chip')?.classList.add('active');
    }
    filterAndRender(input?.value || '', categoryId);
  };

  // Set initial category
  if (activeCategory) {
    window.filterCategory(activeCategory);
  }
}

function filterAndRender(query, categoryId) {
  let products = CONFIG.DEMO_PRODUCTS;
  
  if (categoryId) {
    products = products.filter(p => p.category === categoryId);
  }

  if (query) {
    const q = query.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }

  const container = document.getElementById('search-results');
  const empty = document.getElementById('search-empty');

  if (container) {
    if (products.length > 0) {
      container.innerHTML = products.map(p => renderProductCard(p)).join('');
      container.classList.remove('hidden');
      if (empty) empty.classList.add('hidden');
    } else {
      container.innerHTML = '';
      container.classList.add('hidden');
      if (empty) empty.classList.remove('hidden');
    }
  }
}
