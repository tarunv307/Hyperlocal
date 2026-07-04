// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Home Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { router } from '../router.js';
import { renderProductCard } from '../components/product-card.js';

export function renderHome() {
  const user = appState.get('user');
  const address = appState.get('currentAddress') || 'Detecting your location...';
  const stores = appState.get('stores');
  const offers = CONFIG.DEMO_OFFERS;
  const categories = CONFIG.CATEGORIES;
  const products = appState.get('products');

  // Popular products (random selection)
  const popularProducts = products.sort(() => 0.5 - Math.random()).slice(0, 6);

  return `
    <div class="home-page" id="home-page">
      <!-- Location Bar -->
      <div class="home-location-bar" onclick="window.location.hash='/addresses'">
        <div class="location-icon">
          <span class="material-icons-round">location_on</span>
        </div>
        <div class="location-info">
          <div class="location-label">
            Delivery to <span class="material-icons-round" style="font-size:16px;">expand_more</span>
          </div>
          <div class="location-address" id="home-address">${address}</div>
        </div>
        <button class="btn-icon" style="color:var(--text-secondary);">
          <span class="material-icons-round">notifications_none</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="home-search">
        <div class="search-bar" onclick="window.location.hash='/search'">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Search for groceries, fruits, snacks..." readonly />
          <span class="material-icons-round" style="font-size:20px;">mic</span>
        </div>
      </div>

      <!-- Delivery Banner -->
      <div class="delivery-banner animate-fadeInUp">
        <div class="delivery-banner-title">Get it in ${CONFIG.ESTIMATED_DELIVERY_MINS} minutes! ⚡</div>
        <div class="delivery-banner-text">Fresh groceries & essentials at your doorstep</div>
        <div class="delivery-banner-time">
          <span class="material-icons-round" style="font-size:16px;">schedule</span>
          Delivery in ${CONFIG.ESTIMATED_DELIVERY_MINS}-15 min
        </div>
      </div>

      <!-- Categories -->
      <div class="categories-section">
        <div class="section-header">
          <h3 class="section-title">Shop by Category</h3>
          <span class="section-link" onclick="window.location.hash='/search'">See All</span>
        </div>
        <div class="categories-grid">
          ${categories.map((cat, i) => `
            <div class="category-item animate-fadeInUp stagger-${i + 1}" onclick="window.location.hash='/search?category=${cat.id}'">
              <div class="category-icon-wrapper" style="background:${cat.color}15;">
                <span>${cat.icon}</span>
              </div>
              <span class="category-name">${cat.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Best Offers -->
      <div class="offers-section">
        <div class="section-header">
          <h3 class="section-title">Best Offers 🔥</h3>
          <span class="section-link">View All</span>
        </div>
        <div class="h-scroll">
          ${offers.map(offer => `
            <div class="offer-card ${offer.gradient}">
              <div class="offer-card-discount">${offer.discount}</div>
              <div class="offer-card-title">${offer.title}</div>
              <div class="offer-card-subtitle">${offer.subtitle}</div>
              <div class="offer-card-code">${offer.code}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Nearby Stores -->
      <div class="stores-section">
        <div class="section-header">
          <h3 class="section-title">Nearby Stores 📍</h3>
          <span class="section-link">See All</span>
        </div>
        <div class="h-scroll">
          ${stores.map(store => `
            <div class="store-card" onclick="window.location.hash='/store?id=${store.id}'">
              <div class="store-card-image" style="position:relative;">
                <img src="${store.image}" alt="${store.name}" loading="lazy" 
                     onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:140px;background:var(--accent);font-size:48px;\\'>🏪</div>'" />
                ${store.discount ? `<div class="store-card-badge">${store.discount}</div>` : ''}
              </div>
              <div class="store-card-body">
                <div class="store-card-name">${store.name}</div>
                <div class="store-card-info">
                  <span class="store-card-rating">
                    <span class="material-icons-round">star</span>
                    ${store.rating}
                  </span>
                  <span class="store-card-dot"></span>
                  <span>${store.deliveryTime}</span>
                  <span class="store-card-dot"></span>
                  <span>${store.distance}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Popular Products -->
      <div class="stores-section">
        <div class="section-header">
          <h3 class="section-title">Popular Products ⭐</h3>
          <span class="section-link" onclick="window.location.hash='/search'">See All</span>
        </div>
        <div class="product-grid">
          ${popularProducts.map(p => renderProductCard(p)).join('')}
        </div>
      </div>

      <!-- Map Section -->
      <div style="padding:0 var(--space-lg);margin-top:var(--space-2xl);">
        <div class="section-header" style="padding:0;margin-bottom:var(--space-md);">
          <h3 class="section-title">Stores Near You 🗺️</h3>
        </div>
        <div id="home-map" style="width:100%;height:220px;border-radius:var(--radius-xl);overflow:hidden;background:var(--accent);display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;color:var(--text-muted);">
            <span class="material-icons-round" style="font-size:48px;color:var(--primary);">map</span>
            <p style="font-size:var(--fs-sm);margin-top:8px;">Map loading...</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initHome() {
  // Detect location
  detectLocation();
  
  // Init map
  initHomeMap();

  // Update cart badge
  appState.updateCartBadge();
}

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        appState.set('currentLocation', { lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        initHomeMap(); // Re-center map to actual location
      },
      () => {
        appState.set('currentLocation', null);
        const el = document.getElementById('home-address');
        if (el) el.textContent = 'Select your location';
        appState.set('currentAddress', 'Select your location');
        initHomeMap();
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  } else {
    // Fallback for insecure context or unsupported browsers
    appState.set('currentLocation', null);
    const el = document.getElementById('home-address');
    if (el) el.textContent = 'Select your location';
    appState.set('currentAddress', 'Select your location');
    initHomeMap();
  }
}

function reverseGeocode(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
    .then(res => res.json())
    .then(data => {
      if (data && data.display_name) {
        const address = data.display_name;
        const shortAddress = address.length > 50 ? address.substring(0, 50) + '...' : address;
        const el = document.getElementById('home-address');
        if (el) el.textContent = shortAddress;
        appState.set('currentAddress', shortAddress);
      }
    })
    .catch(() => {
      const el = document.getElementById('home-address');
      if (el) el.textContent = 'Location Found';
      appState.set('currentAddress', 'Location Found');
    });
}

function initHomeMap() {
  const mapEl = document.getElementById('home-map');
  if (!mapEl) return;

  if (window.L) {
    const loc = appState.get('currentLocation');
    
    // Clear any existing map instance before creating a new one
    if (mapEl._leaflet_id) {
      mapEl.outerHTML = mapEl.outerHTML; // simple way to clear the container
      initHomeMap(); // recursive call after DOM reset
      return;
    }

    if (!loc) {
       mapEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface);color:var(--text-muted);font-size:var(--fs-sm);padding:20px;text-align:center;cursor:pointer;" onclick="window.location.hash='/addresses'">Please tap here to select your delivery location 📍</div>`;
       return;
    }

    const map = L.map('home-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([loc.lat, loc.lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="width:16px;height:16px;background:#2ECC71;border:3px solid #FFF;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    L.marker([loc.lat, loc.lng], { icon: userIcon }).addTo(map);

    // Store markers
    appState.get('stores').forEach((store, i) => {
      const offset = (i + 1) * 0.003;
      const storeLat = loc.lat + offset * (i % 2 ? 1 : -1);
      const storeLng = loc.lng + offset * (i % 2 ? -1 : 1);
      
      const storeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="width:24px;height:24px;background:#E74C3C;border:2px solid #FFF;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;box-shadow:0 2px 5px rgba(0,0,0,0.3);">${store.name.charAt(0)}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      
      L.marker([storeLat, storeLng], { icon: storeIcon }).bindPopup(`<b>${store.name}</b>`).addTo(map);
    });
  } else {
    // Fallback: show a styled placeholder
    mapEl.innerHTML = `
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#d4efdf,#a8e6cf);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
        <span class="material-icons-round" style="font-size:48px;color:var(--primary);">map</span>
        <p style="font-size:var(--fs-sm);color:var(--primary-dark);font-weight:500;">Map loading failed</p>
      </div>
    `;
  }
}
