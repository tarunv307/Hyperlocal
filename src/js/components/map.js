// ═══════════════════════════════════════════════════════════
// Google Maps Component
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export function initMap(elementId, options = {}) {
  const el = document.getElementById(elementId);
  if (!el || !window.google?.maps) {
    if (el) {
      el.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#d4efdf,#a8e6cf);flex-direction:column;gap:8px;">
          <span class="material-icons-round" style="font-size:48px;color:var(--primary);">map</span>
          <p style="font-size:var(--fs-sm);color:var(--primary-dark);font-weight:500;">Map requires Google Maps API key</p>
        </div>
      `;
    }
    return null;
  }

  const center = options.center || appState.get('currentLocation') || CONFIG.DEFAULT_LOCATION;

  const map = new google.maps.Map(el, {
    center: center,
    zoom: options.zoom || 15,
    disableDefaultUI: options.disableUI !== false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: getMapStyles(),
    tilt: options.tilt || 0,
    heading: options.heading || 0,
    ...options.mapOptions,
  });

  return map;
}

export function addMarker(map, position, options = {}) {
  if (!map || !window.google?.maps) return null;
  
  return new google.maps.Marker({
    position,
    map,
    title: options.title || '',
    icon: options.icon || {
      path: google.maps.SymbolPath.CIRCLE,
      scale: options.scale || 10,
      fillColor: options.color || '#2ECC71',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 3,
    },
    label: options.label || undefined,
    draggable: options.draggable || false,
  });
}

function getMapStyles() {
  return [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#aadaff' }] },
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e0e0e0' }] },
    { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: '#f5f5f5' }] },
  ];
}
