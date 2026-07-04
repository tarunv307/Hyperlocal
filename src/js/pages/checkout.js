// ═══════════════════════════════════════════════════════════
// Checkout Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../app.js';
import { insertData } from '../supabase.js';

export function renderCheckout() {
  const cart = appState.get('cart');
  const subtotal = appState.getCartTotal();
  const deliveryCharge = subtotal >= CONFIG.FREE_DELIVERY_ABOVE ? 0 : CONFIG.DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge + CONFIG.PLATFORM_FEE;
  const address = appState.get('currentAddress') || 'Add delivery address';

  return `
    <div id="checkout-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Checkout</h4>
      </div>

      <!-- Delivery Address -->
      <div class="checkout-section">
        <div class="checkout-section-title">
          <span class="material-icons-round">location_on</span>
          Delivery Address
        </div>
        <div class="address-card selected" onclick="window.location.hash='/address'">
          <div class="address-card-icon">
            <span class="material-icons-round">home</span>
          </div>
          <div class="address-card-content">
            <div class="address-card-label">Home</div>
            <div class="address-card-text">${address}</div>
          </div>
          <span class="material-icons-round" style="color:var(--text-light);">edit</span>
        </div>
      </div>

      <!-- Delivery Time -->
      <div class="checkout-section">
        <div class="checkout-section-title">
          <span class="material-icons-round">schedule</span>
          Delivery Time
        </div>
        <div style="display:flex;gap:12px;">
          <div class="chip active" style="flex:1;justify-content:center;padding:12px;">
            <span class="material-icons-round" style="font-size:16px;">flash_on</span>
            Express (10-15 min)
          </div>
          <div class="chip" style="flex:1;justify-content:center;padding:12px;">
            <span class="material-icons-round" style="font-size:16px;">schedule</span>
            Scheduled
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="checkout-section">
        <div class="checkout-section-title">
          <span class="material-icons-round">payment</span>
          Payment Method
        </div>

        <div class="payment-method selected" onclick="window.selectPayment(this, 'upi')" data-method="upi">
          <div class="payment-radio"></div>
          <div class="payment-icon" style="background:#5f259f15;color:#5f259f;">
            <span class="material-icons-round">account_balance</span>
          </div>
          <div style="flex:1;">
            <div class="payment-label">UPI</div>
            <div class="payment-sublabel">Google Pay, PhonePe, Paytm</div>
          </div>
        </div>

        <div class="payment-method" onclick="window.selectPayment(this, 'card')" data-method="card">
          <div class="payment-radio"></div>
          <div class="payment-icon" style="background:#1a73e815;color:#1a73e8;">
            <span class="material-icons-round">credit_card</span>
          </div>
          <div style="flex:1;">
            <div class="payment-label">Credit / Debit Card</div>
            <div class="payment-sublabel">Visa, Mastercard, RuPay</div>
          </div>
        </div>

        <div class="payment-method" onclick="window.selectPayment(this, 'wallet')" data-method="wallet">
          <div class="payment-radio"></div>
          <div class="payment-icon" style="background:#f3910015;color:#f39100;">
            <span class="material-icons-round">account_balance_wallet</span>
          </div>
          <div style="flex:1;">
            <div class="payment-label">Wallet</div>
            <div class="payment-sublabel">Paytm, Amazon Pay</div>
          </div>
        </div>

        <div class="payment-method" onclick="window.selectPayment(this, 'cod')" data-method="cod">
          <div class="payment-radio"></div>
          <div class="payment-icon" style="background:#2ecc7115;color:#2ecc71;">
            <span class="material-icons-round">payments</span>
          </div>
          <div style="flex:1;">
            <div class="payment-label">Cash on Delivery</div>
            <div class="payment-sublabel">Pay when you receive</div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="checkout-section" style="border-bottom:none;">
        <div class="checkout-section-title">
          <span class="material-icons-round">receipt</span>
          Order Summary
        </div>
        <div style="font-size:var(--fs-sm);color:var(--text-secondary);">
          ${cart.map(item => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;">
              <span>${item.name} × ${item.quantity}</span>
              <span style="font-weight:600;">${CONFIG.CURRENCY}${item.price * item.quantity}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;">
            <span>Subtotal</span><span>${CONFIG.CURRENCY}${subtotal}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;">
            <span>Delivery</span>
            <span style="color:${deliveryCharge === 0 ? 'var(--success)' : 'inherit'}">${deliveryCharge === 0 ? 'FREE' : CONFIG.CURRENCY + deliveryCharge}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;">
            <span>Platform Fee</span><span>${CONFIG.CURRENCY}${CONFIG.PLATFORM_FEE}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0 0;border-top:2px dashed var(--border);margin-top:8px;font-weight:700;font-size:var(--fs-md);color:var(--text-primary);">
            <span>Total</span><span>${CONFIG.CURRENCY}${total}</span>
          </div>
        </div>
      </div>

      <!-- Place Order Button -->
      <div style="padding:16px 20px 100px;">
        <button class="btn btn-primary btn-full btn-lg btn-pill" id="place-order-btn" onclick="window.placeOrder()">
          <span class="material-icons-round">shopping_bag</span>
          Place Order — ${CONFIG.CURRENCY}${total}
        </button>
      </div>
    </div>
  `;
}

export function initCheckout() {
  let selectedPayment = 'upi';

  window.selectPayment = function(el, method) {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = method;
  };

  window.placeOrder = async function() {
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px;"></span> Placing Order...';

    const orderPayload = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      items: [...appState.get('cart')],
      total: appState.getCartTotal() + CONFIG.PLATFORM_FEE + (appState.getCartTotal() >= CONFIG.FREE_DELIVERY_ABOVE ? 0 : CONFIG.DELIVERY_CHARGE),
      status: 'pending',
      customer_id: appState.get('user') ? (appState.get('user').name || appState.get('user').email) : 'Guest User',
      delivery_address: appState.get('currentAddress') || 'Bangalore, Karnataka'
    };

    // Insert to Supabase (this will trigger real-time signal)
    const { error } = await insertData('orders', orderPayload);

    if (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Try again.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-icons-round">shopping_bag</span> Place Order';
      return;
    }

    appState.addOrder(orderPayload);
    appState.clearCart();
    appState.set('activeOrder', orderPayload);

    appState.addNotification({
      title: 'Order Placed! ⏳',
      message: `Your order ${orderPayload.id} is pending admin confirmation.`,
      type: 'order',
      icon: 'pending_actions'
    });

    showToast('Order placed! Waiting for confirmation...', 'success');
    router.navigate('/order-tracking', { id: order.id });
  };
}
