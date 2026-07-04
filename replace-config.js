const fs = require('fs');
const path = require('path');

const files = [
  'src/js/pages/home.js',
  'src/js/pages/search.js',
  'src/js/pages/wishlist.js',
  'src/js/pages/admin/products.js',
  'src/js/pages/admin/stores.js',
  'src/js/pages/store.js',
  'src/js/components/product-card.js'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/CONFIG\.DEMO_PRODUCTS/g, "appState.get('products')");
    content = content.replace(/CONFIG\.DEMO_STORES/g, "appState.get('stores')");
    fs.writeFileSync(p, content);
  }
});
console.log('Replaced successfully');
