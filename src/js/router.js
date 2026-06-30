// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - SPA Router
// Hash-based routing with page transitions
// ═══════════════════════════════════════════════════════════

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.previousRoute = null;
    this.container = null;
    this.authRequired = new Set();
    this.adminRequired = new Set();
    this.onRouteChange = null;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  register(path, renderFn, options = {}) {
    this.routes[path] = { render: renderFn, ...options };
    if (options.authRequired) this.authRequired.add(path);
    if (options.adminRequired) this.adminRequired.add(path);
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const [path, queryString] = hash.split('?');
    const params = this.parseQuery(queryString);

    // Check auth
    const state = window.appState;
    if (this.authRequired.has(path) && state && !state.get('isLoggedIn')) {
      this.navigate('/login');
      return;
    }
    if (this.adminRequired.has(path) && state) {
      const user = state.get('user');
      if (!user || user.role !== 'admin') {
        this.navigate('/home');
        return;
      }
    }

    const route = this.routes[path];
    if (!route) {
      this.navigate('/home');
      return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = path;

    // Page transition
    if (this.container) {
      this.container.classList.remove('page-enter', 'page-fade-in');

      // Render new page
      const html = await route.render(params);
      if (typeof html === 'string') {
        this.container.innerHTML = html;
      }

      // Animate in
      this.container.classList.add('page-enter');
      setTimeout(() => this.container.classList.remove('page-enter'), 350);

      // After render callback
      if (route.afterRender) {
        await route.afterRender(params);
      }
    }

    // Notify navigation change
    if (this.onRouteChange) {
      this.onRouteChange(path, params);
    }

    // Scroll to top
    window.scrollTo({ top: 0 });
  }

  navigate(path, params = {}) {
    const query = Object.keys(params).length 
      ? '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
      : '';
    window.location.hash = path + query;
  }

  back() {
    if (this.previousRoute) {
      window.history.back();
    } else {
      this.navigate('/home');
    }
  }

  parseQuery(queryString) {
    if (!queryString) return {};
    const params = {};
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}

export const router = new Router();
