// ═══════════════════════════════════════════════════════════
// Addresses Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { showToast } from '../app.js';

export function renderAddresses() {
  const addresses = [
    { id: 1, label: 'Home', icon: 'home', address: appState.get('currentAddress') || 'Bangalore, Karnataka', isDefault: true },
    { id: 2, label: 'Work', icon: 'work', address: 'Tech Park, Whitefield, Bangalore', isDefault: false },
  ];

  return `
    <div id="addresses-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Saved Addresses</h4>
      </div>

      <div style="padding:16px 20px;">
        <!-- Use Current Location -->
        <button class="btn btn-outline btn-full btn-pill" style="margin-bottom:20px;" onclick="window.useCurrentLocation()">
          <span class="material-icons-round">my_location</span>
          Use Current Location
        </button>

        ${addresses.map(addr => `
          <div class="address-card ${addr.isDefault ? 'selected' : ''}" style="margin-bottom:12px;" onclick="window.selectAddress(${addr.id})">
            <div class="address-card-icon">
              <span class="material-icons-round">${addr.icon}</span>
            </div>
            <div class="address-card-content">
              <div class="address-card-label">${addr.label} ${addr.isDefault ? '<span class="badge badge-primary" style="margin-left:6px;">Default</span>' : ''}</div>
              <div class="address-card-text">${addr.address}</div>
            </div>
            <span class="material-icons-round" style="color:var(--text-light);font-size:20px;">more_vert</span>
          </div>
        `).join('')}

        <!-- Add New Address -->
        <button class="btn btn-primary btn-full btn-lg btn-pill" style="margin-top:20px;" onclick="window.location.hash='/address'">
          <span class="material-icons-round">add_location</span>
          Add New Address
        </button>
      </div>
    </div>
  `;
}

export function initAddresses() {
  window.selectAddress = function(id) {
    showToast('Address selected', 'success');
    window.history.back();
  };

  window.useCurrentLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        appState.set('currentLocation', { lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('Location updated! 📍', 'success');
      }, (err) => {
        showToast('Location access denied. Please enter manually.', 'error');
      }, { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 });
    } else {
      showToast('Geolocation not supported on this device', 'error');
    }
  };
}
