// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Main Entry Point
// ═══════════════════════════════════════════════════════════

import { router } from './router.js';
import { appState } from './state.js';
import { initSupabase } from './supabase.js';

// ── Page Imports ──────────────────────────────────────────
import { renderLogin, initLogin } from './pages/login.js';
import { renderRegister, initRegister } from './pages/register.js';
import { renderForgotPassword, initForgotPassword } from './pages/forgot-password.js';
import { renderOTPVerify, initOTPVerify } from './pages/otp-verify.js';
import { renderHome, initHome } from './pages/home.js';
import { renderSearch, initSearch } from './pages/search.js';
import { renderStore, initStore } from './pages/store.js';
import { renderCart, initCart } from './pages/cart.js';
import { renderCheckout, initCheckout } from './pages/checkout.js';
import { renderAddress, initAddress } from './pages/address.js';
import { renderOrderTracking, initOrderTracking } from './pages/order-tracking.js';
import { renderOrders, initOrders } from './pages/orders.js';
import { renderProfile, initProfile } from './pages/profile.js';
import { renderEditProfile, initEditProfile } from './pages/edit-profile.js';
import { renderWishlist, initWishlist } from './pages/wishlist.js';
import { renderAddresses, initAddresses } from './pages/addresses.js';
import { renderNotifications, initNotifications } from './pages/notifications.js';
import { renderReview, initReview } from './pages/review.js';
import { renderAdminDashboard, initAdminDashboard } from './pages/admin/dashboard.js';
import { renderAdminUsers, initAdminUsers } from './pages/admin/users.js';
import { renderAdminStores, initAdminStores } from './pages/admin/stores.js';
import { renderAdminProducts, initAdminProducts } from './pages/admin/products.js';
import { renderAdminOrders, initAdminOrders } from './pages/admin/orders.js';

// ── Toast System ──────────────────────────────────────────
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-icons-round">${icons[type] || 'info'}</span>
    <span style="flex:1;">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make showToast globally available
window.showToast = showToast;

// ── Loading ───────────────────────────────────────────────
export function showLoading(show = true) {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.toggle('hidden', !show);
}

// ── Navigation Visibility ─────────────────────────────────
const noNavPages = ['/login', '/register', '/forgot-password', '/otp-verify', '/address',
  '/admin/dashboard', '/admin/users', '/admin/stores', '/admin/products', '/admin/orders'];

function updateNavVisibility(path) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  
  const hideNav = noNavPages.includes(path);
  nav.classList.toggle('hidden', hideNav);
  
  const container = document.getElementById('page-container');
  if (container) {
    container.classList.toggle('no-bottom-nav', hideNav);
  }

  // Update active nav item
  const pageMap = {
    '/home': 'home',
    '/search': 'search',
    '/cart': 'cart',
    '/orders': 'orders',
    '/profile': 'profile',
  };

  nav.querySelectorAll('.nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    item.classList.toggle('active', pageMap[path] === page);
  });
}

// ── Initialize App ────────────────────────────────────────
function initApp() {
  // Initialize Supabase
  initSupabase();

  // Initialize Router
  router.init('page-container');

  // ── Register Routes ─────────────────────────────────────

  // Auth routes (no auth required)
  router.register('/login', renderLogin, { afterRender: initLogin });
  router.register('/register', renderRegister, { afterRender: initRegister });
  router.register('/forgot-password', renderForgotPassword, { afterRender: initForgotPassword });
  router.register('/otp-verify', renderOTPVerify, { afterRender: initOTPVerify });

  // Main app routes (auth required)
  router.register('/home', renderHome, { afterRender: initHome, authRequired: true });
  router.register('/search', renderSearch, { afterRender: initSearch, authRequired: true });
  router.register('/store', renderStore, { afterRender: initStore, authRequired: true });
  router.register('/cart', renderCart, { afterRender: initCart, authRequired: true });
  router.register('/checkout', renderCheckout, { afterRender: initCheckout, authRequired: true });
  router.register('/address', renderAddress, { afterRender: initAddress, authRequired: true });
  router.register('/order-tracking', renderOrderTracking, { afterRender: initOrderTracking, authRequired: true });
  router.register('/orders', renderOrders, { afterRender: initOrders, authRequired: true });
  router.register('/profile', renderProfile, { afterRender: initProfile, authRequired: true });
  router.register('/edit-profile', renderEditProfile, { afterRender: initEditProfile, authRequired: true });
  router.register('/wishlist', renderWishlist, { afterRender: initWishlist, authRequired: true });
  router.register('/addresses', renderAddresses, { afterRender: initAddresses, authRequired: true });
  router.register('/notifications', renderNotifications, { afterRender: initNotifications, authRequired: true });
  router.register('/review', renderReview, { afterRender: initReview, authRequired: true });

  // Admin routes
  router.register('/admin/dashboard', renderAdminDashboard, { afterRender: initAdminDashboard, authRequired: true });
  router.register('/admin/users', renderAdminUsers, { afterRender: initAdminUsers, authRequired: true });
  router.register('/admin/stores', renderAdminStores, { afterRender: initAdminStores, authRequired: true });
  router.register('/admin/products', renderAdminProducts, { afterRender: initAdminProducts, authRequired: true });
  router.register('/admin/orders', renderAdminOrders, { afterRender: initAdminOrders, authRequired: true });

  // Route change handler
  router.onRouteChange = (path) => {
    updateNavVisibility(path);
    appState.updateCartBadge();
  };

  // Bottom nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      router.navigate('/' + page);
    });
  });

  // Initial route
  const hash = window.location.hash.slice(1);
  if (!hash) {
    if (appState.get('isLoggedIn')) {
      router.navigate('/home');
    } else {
      router.navigate('/login');
    }
  } else {
    router.handleRoute();
  }

  // Update cart badge on load
  appState.updateCartBadge();

  console.log('🚀 HyperLocal Delivery App initialized!');
}

// ── Start App ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);
