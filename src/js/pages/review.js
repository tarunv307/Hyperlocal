// ═══════════════════════════════════════════════════════════
// Review / Rating Page
// ═══════════════════════════════════════════════════════════

import { showToast } from '../app.js';

export function renderReview(params = {}) {
  return `
    <div id="review-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Rate Your Experience</h4>
      </div>

      <!-- Rate Products -->
      <div class="review-section">
        <div class="review-emoji">🛍️</div>
        <div class="review-question">How were the products?</div>
        <div class="review-stars" id="product-stars">
          ${[1,2,3,4,5].map(i => `
            <span class="material-icons-round review-star" data-rating="${i}" onclick="window.setRating('product', ${i})">star</span>
          `).join('')}
        </div>
      </div>

      <div class="divider-thick"></div>

      <!-- Rate Delivery -->
      <div class="review-section">
        <div class="review-emoji">🛵</div>
        <div class="review-question">How was the delivery?</div>
        <div class="review-stars" id="delivery-stars">
          ${[1,2,3,4,5].map(i => `
            <span class="material-icons-round review-star" data-rating="${i}" onclick="window.setRating('delivery', ${i})">star</span>
          `).join('')}
        </div>
      </div>

      <div class="divider-thick"></div>

      <!-- Feedback -->
      <div class="review-section">
        <div class="review-question" style="font-size:var(--fs-md);">Any feedback?</div>
        <textarea class="review-textarea" id="review-feedback" placeholder="Tell us about your experience..."></textarea>
        <button class="btn btn-primary btn-full btn-lg btn-pill" style="margin-top:20px;" onclick="window.submitReview()">
          <span class="material-icons-round">send</span>
          Submit Review
        </button>
      </div>
    </div>
  `;
}

export function initReview() {
  window.setRating = function(type, rating) {
    const container = document.getElementById(`${type}-stars`);
    if (!container) return;
    container.querySelectorAll('.review-star').forEach((star, i) => {
      star.classList.toggle('filled', i < rating);
    });
  };

  window.submitReview = function() {
    showToast('Thank you for your feedback! ⭐', 'success');
    setTimeout(() => window.history.back(), 1000);
  };
}
