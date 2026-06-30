// ═══════════════════════════════════════════════════════════
// Order Tracking Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export function renderOrderTracking(params = {}) {
  const orderId = params.id;
  const order = appState.get('activeOrder') || appState.get('orders')?.[0];
  
  if (!order) {
    return `
      <div>
        <div class="app-header">
          <button class="header-back-btn" onclick="window.location.hash='/orders'">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <h4 class="app-header-title">Order Tracking</h4>
        </div>
        <div class="empty-state">
          <span class="material-icons-round empty-state-icon">local_shipping</span>
          <h4 class="empty-state-title">No active orders</h4>
          <p class="empty-state-text">Place an order to see live tracking here</p>
          <button class="btn btn-primary btn-pill" onclick="window.location.hash='/home'">Order Now</button>
        </div>
      </div>
    `;
  }

  const steps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: 'check_circle', time: 'Just now' },
    { id: 'preparing', label: 'Store Preparing', icon: 'restaurant', time: '~3 min' },
    { id: 'assigned', label: 'Delivery Partner Assigned', icon: 'delivery_dining', time: '~5 min' },
    { id: 'picked', label: 'Out for Delivery', icon: 'local_shipping', time: '~8 min' },
    { id: 'delivered', label: 'Delivered', icon: 'where_to_vote', time: '~10 min' }
  ];

  const statusOrder = ['confirmed', 'preparing', 'assigned', 'picked', 'delivered'];
  const currentIdx = Math.max(0, statusOrder.indexOf(order.status || 'confirmed'));

  return `
    <div id="tracking-page" class="tracking-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/orders'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Order #${order.id}</h4>
      </div>

      <!-- Map -->
      <div class="tracking-map" id="tracking-map">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#d4efdf,#a8e6cf);">
          <div style="text-align:center;">
            <span class="material-icons-round animate-bounce" style="font-size:48px;color:var(--primary);">delivery_dining</span>
            <p style="font-size:var(--fs-sm);color:var(--primary-dark);margin-top:8px;">Live tracking active</p>
          </div>
        </div>
      </div>

      <!-- ETA Card -->
      <div class="tracking-info-card">
        <div class="tracking-eta">
          <div class="tracking-eta-time" id="tracking-eta">${CONFIG.ESTIMATED_DELIVERY_MINS} min</div>
          <div class="tracking-eta-label">Estimated Delivery Time</div>
        </div>

        <!-- Progress Steps -->
        <div class="progress-steps">
          ${steps.map((step, i) => {
            const isCompleted = i < currentIdx;
            const isActive = i === currentIdx;
            const cls = isCompleted ? 'completed' : (isActive ? 'active' : '');
            return `
              <div class="progress-step ${cls}">
                <div class="progress-step-indicator">
                  <div class="progress-step-dot">
                    <span class="material-icons-round">${isCompleted ? 'check' : (isActive ? step.icon : '')}</span>
                  </div>
                  ${i < steps.length - 1 ? '<div class="progress-step-line"></div>' : ''}
                </div>
                <div class="progress-step-content">
                  <div class="progress-step-title">${step.label}</div>
                  <div class="progress-step-time">${isCompleted ? '✓ Done' : (isActive ? 'In Progress...' : step.time)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Driver Info -->
        ${currentIdx >= 2 ? `
          <div class="tracking-driver">
            <div class="avatar">R</div>
            <div class="tracking-driver-info">
              <div class="tracking-driver-name">Rajesh Kumar</div>
              <div class="tracking-driver-vehicle">Honda Activa • KA 01 AB 1234</div>
            </div>
            <div class="tracking-driver-actions">
              <button class="tracking-driver-btn">
                <span class="material-icons-round">call</span>
              </button>
              <button class="tracking-driver-btn">
                <span class="material-icons-round">chat</span>
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Order Details -->
      <div style="padding:20px;">
        <h4 style="font-family:var(--font-heading);margin-bottom:12px;">Order Details</h4>
        <div style="background:var(--accent);border-radius:var(--radius-lg);padding:16px;">
          ${(order.items || []).map(item => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:var(--fs-sm);">
              <span>${item.name} × ${item.quantity}</span>
              <span style="font-weight:600;">${CONFIG.CURRENCY}${item.price * item.quantity}</span>
            </div>
          `).join('')}
          <div style="border-top:1px dashed var(--border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;">
            <span>Total</span>
            <span>${CONFIG.CURRENCY}${order.total}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initOrderTracking(params = {}) {
  initTrackingMap();
  simulateTracking();
}

function initTrackingMap() {
  const mapEl = document.getElementById('tracking-map');
  if (!mapEl || !window.L) return;

  const loc = appState.get('currentLocation') || CONFIG.DEFAULT_LOCATION;
  
  if (mapEl._leaflet_id) {
    mapEl.outerHTML = mapEl.outerHTML;
    initTrackingMap();
    return;
  }

  const map = L.map('tracking-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([loc.lat, loc.lng], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  // Delivery marker
  const deliveryIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width:20px;height:20px;background:#E74C3C;border:3px solid #FFF;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
  L.marker([loc.lat + 0.005, loc.lng + 0.003], { icon: deliveryIcon }).bindPopup('Delivery Partner').addTo(map);

  // User marker
  const userIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width:20px;height:20px;background:#2ECC71;border:3px solid #FFF;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
  L.marker([loc.lat, loc.lng], { icon: userIcon }).bindPopup('Your Location').addTo(map);
}

function simulateTracking() {
  const order = appState.get('activeOrder');
  if (!order) return;

  const statuses = ['confirmed', 'preparing', 'assigned', 'picked', 'delivered'];
  let idx = statuses.indexOf(order.status || 'confirmed');
  const etaEl = document.getElementById('tracking-eta');

  const interval = setInterval(() => {
    idx++;
    if (idx >= statuses.length) {
      clearInterval(interval);
      if (etaEl) etaEl.textContent = 'Delivered! 🎉';
      return;
    }
    
    appState.set('activeOrder', { ...appState.get('activeOrder'), status: statuses[idx] });
    const times = [10, 8, 5, 2, 0];
    if (etaEl) etaEl.textContent = times[idx] > 0 ? times[idx] + ' min' : 'Delivered! 🎉';

    // Update progress steps
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, i) => {
      step.classList.remove('completed', 'active');
      if (i < idx) step.classList.add('completed');
      if (i === idx) step.classList.add('active');
    });
  }, 5000);
}
