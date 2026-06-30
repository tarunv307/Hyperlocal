// ═══════════════════════════════════════════════════════════
// Admin - Manage Users
// ═══════════════════════════════════════════════════════════

export function renderAdminUsers() {
  const demoUsers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', role: 'customer', orders: 12, status: 'active' },
    { id: 2, name: 'Priya Sharma', email: 'priya@email.com', role: 'customer', orders: 8, status: 'active' },
    { id: 3, name: 'Amit Patel', email: 'amit@email.com', role: 'store_owner', orders: 0, status: 'active' },
    { id: 4, name: 'Neha Singh', email: 'neha@email.com', role: 'delivery', orders: 0, status: 'active' },
    { id: 5, name: 'Suresh Reddy', email: 'suresh@email.com', role: 'customer', orders: 23, status: 'inactive' },
    { id: 6, name: 'Kavita Jain', email: 'kavita@email.com', role: 'customer', orders: 5, status: 'active' },
  ];

  return `
    <div id="admin-users" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Manage Users</h4>
      </div>

      <div style="padding:16px;">
        <div class="search-bar" style="margin-bottom:16px;">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Search users..." id="user-search" />
        </div>

        <!-- Role Filter -->
        <div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;">
          <button class="chip active">All</button>
          <button class="chip">Customers</button>
          <button class="chip">Store Owners</button>
          <button class="chip">Delivery</button>
        </div>
      </div>

      <div class="admin-table-wrapper" style="margin-top:0;">
        <div class="admin-table-header">
          <span class="admin-table-title">Users (${demoUsers.length})</span>
        </div>
        ${demoUsers.map(user => `
          <div class="admin-table-row" style="cursor:pointer;">
            <div class="avatar avatar-sm" style="background:${user.role === 'store_owner' ? '#3498db15' : user.role === 'delivery' ? '#e67e2215' : 'var(--primary-lighter)'}; color:${user.role === 'store_owner' ? '#3498db' : user.role === 'delivery' ? '#e67e22' : 'var(--primary-dark)'};">
              ${user.name.charAt(0)}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:var(--fs-sm);">${user.name}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">${user.email}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge ${user.role === 'customer' ? 'badge-primary' : user.role === 'store_owner' ? 'badge-info' : 'badge-warning'}" style="font-size:9px;">${user.role}</span>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:4px;">${user.orders} orders</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initAdminUsers() {}
