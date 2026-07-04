// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - State Management
// Reactive state with LocalStorage persistence
// ═══════════════════════════════════════════════════════════

class AppState {
  constructor() {
    this.state = {
      // Auth
      isLoggedIn: false,
      user: null,

      // Location
      currentLocation: null,
      currentAddress: '',

      // Cart
      cart: [],
      
      // Wishlist
      wishlist: [],

      // Orders
      orders: [],
      activeOrder: null,

      // Notifications
      notifications: [],
      unreadCount: 0,

      // UI
      selectedStore: null,
      searchQuery: '',
      selectedCategory: null,
    };

    this.listeners = {};
    this.loadFromStorage();

    // Listen for cross-tab storage events to simulate real-time updates
    window.addEventListener('storage', (e) => {
      if (e.key === 'hyperlocal_state') {
        this.loadFromStorage();
        if (window.appRouter) {
          window.appRouter.handleRoute();
        }
      }
    });
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.notify(key, value, oldValue);
    this.saveToStorage();
  }

  update(key, updaterFn) {
    const oldValue = this.state[key];
    this.state[key] = updaterFn(oldValue);
    this.notify(key, this.state[key], oldValue);
    this.saveToStorage();
  }

  on(key, callback) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  notify(key, newValue, oldValue) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(cb => cb(newValue, oldValue));
    }
    if (this.listeners['*']) {
      this.listeners['*'].forEach(cb => cb(key, newValue, oldValue));
    }
  }

  // ── Cart Operations ─────────────────────────────────────

  addToCart(product) {
    this.update('cart', cart => {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        return cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...cart, { ...product, quantity: 1 }];
    });
    this.updateCartBadge();
  }

  removeFromCart(productId) {
    this.update('cart', cart => cart.filter(item => item.id !== productId));
    this.updateCartBadge();
  }

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.update('cart', cart => 
      cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
    this.updateCartBadge();
  }

  getCartItem(productId) {
    return this.state.cart.find(item => item.id === productId);
  }

  getCartTotal() {
    return this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSavings() {
    return this.state.cart.reduce((sum, item) => {
      const original = item.originalPrice || item.price;
      return sum + ((original - item.price) * item.quantity);
    }, 0);
  }

  clearCart() {
    this.set('cart', []);
    this.updateCartBadge();
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getCartCount();
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
      if (count > 0) {
        badge.style.animation = 'none';
        badge.offsetHeight; // Trigger reflow
        badge.style.animation = 'cartBounce 0.4s var(--ease-bounce)';
      }
    }
  }

  // ── Wishlist Operations ─────────────────────────────────

  toggleWishlist(productId) {
    this.update('wishlist', list => {
      if (list.includes(productId)) {
        return list.filter(id => id !== productId);
      }
      return [...list, productId];
    });
  }

  isInWishlist(productId) {
    return this.state.wishlist.includes(productId);
  }

  // ── Order Operations ────────────────────────────────────

  addOrder(order) {
    this.update('orders', orders => [order, ...orders]);
  }

  updateOrder(orderId, updates) {
    this.update('orders', orders => 
      orders.map(o => o.id === orderId ? { ...o, ...updates } : o)
    );
  }

  // ── Notification Operations ─────────────────────────────

  addNotification(notification) {
    this.update('notifications', list => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notification
    }, ...list]);
    this.set('unreadCount', this.state.unreadCount + 1);
  }

  markNotificationRead(id) {
    this.update('notifications', list => 
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    this.set('unreadCount', Math.max(0, this.state.unreadCount - 1));
  }

  // ── Persistence ─────────────────────────────────────────

  saveToStorage() {
    try {
      const toSave = {
        cart: this.state.cart,
        wishlist: this.state.wishlist,
        orders: this.state.orders,
        notifications: this.state.notifications,
        currentAddress: this.state.currentAddress,
        user: this.state.user,
        isLoggedIn: this.state.isLoggedIn,
      };
      localStorage.setItem('hyperlocal_state', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('hyperlocal_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(this.state, parsed);
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
  }

  reset() {
    this.state = {
      ...this.state,
      isLoggedIn: false,
      user: null,
      cart: [],
      activeOrder: null,
    };
    this.saveToStorage();
    this.updateCartBadge();
  }
}

export const appState = new AppState();

// Make globally available for router guard checks
window.appState = appState;
