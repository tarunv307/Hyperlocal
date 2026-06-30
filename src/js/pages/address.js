// ═══════════════════════════════════════════════════════════
// Address Form Page (Add/Edit)
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { showToast } from '../app.js';

export function renderAddress() {
  return `
    <div id="address-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Add Address</h4>
      </div>
      <div style="padding:20px;">
        <!-- Map Preview -->
        <div class="address-map-preview" id="address-map">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#d4efdf,#a8e6cf);">
            <span class="material-icons-round" style="font-size:48px;color:var(--primary);">pin_drop</span>
          </div>
        </div>

        <!-- Address Type -->
        <div class="address-type-btns">
          <button class="address-type-btn active" onclick="window.selectAddrType(this)">
            <span class="material-icons-round" style="font-size:18px;">home</span> Home
          </button>
          <button class="address-type-btn" onclick="window.selectAddrType(this)">
            <span class="material-icons-round" style="font-size:18px;">work</span> Work
          </button>
          <button class="address-type-btn" onclick="window.selectAddrType(this)">
            <span class="material-icons-round" style="font-size:18px;">location_on</span> Other
          </button>
        </div>

        <form id="address-form">
          <div class="input-group has-label">
            <label>Address Line</label>
            <input type="text" class="input-field" id="addr-line" placeholder="House/Flat no., Building name" required />
          </div>
          <div class="input-group has-label">
            <label>Landmark</label>
            <input type="text" class="input-field" id="addr-landmark" placeholder="Nearby landmark" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="input-group has-label">
              <label>City</label>
              <input type="text" class="input-field" id="addr-city" value="Bangalore" />
            </div>
            <div class="input-group has-label">
              <label>Pincode</label>
              <input type="text" class="input-field" id="addr-pincode" placeholder="560001" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg btn-pill" style="margin-top:8px;">
            <span class="material-icons-round">save</span> Save Address
          </button>
        </form>
      </div>
    </div>
  `;
}

export function initAddress() {
  // Init map if available
  const mapEl = document.getElementById('address-map');
  if (mapEl && window.L) {
    const loc = appState.get('currentLocation') || CONFIG.DEFAULT_LOCATION;
    if (mapEl._leaflet_id) {
      mapEl.outerHTML = mapEl.outerHTML;
      initAddress();
      return;
    }
    
    const map = L.map('address-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([loc.lat, loc.lng], 16);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="width:24px;height:24px;background:#2ECC71;border:3px solid #FFF;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,0.4);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon, draggable: true }).addTo(map);
    
    marker.on('dragend', function (e) {
      const pos = marker.getLatLng();
      appState.set('currentLocation', { lat: pos.lat, lng: pos.lng });
    });
  }

  window.selectAddrType = function(btn) {
    document.querySelectorAll('.address-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  const form = document.getElementById('address-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const line = document.getElementById('addr-line').value.trim();
      const city = document.getElementById('addr-city').value.trim();
      if (!line) { showToast('Please enter address', 'error'); return; }
      appState.set('currentAddress', `${line}, ${city}`);
      showToast('Address saved! 📍', 'success');
      window.history.back();
    });
  }
}
