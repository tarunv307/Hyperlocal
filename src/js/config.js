// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Configuration
// ═══════════════════════════════════════════════════════════

export const CONFIG = {
  // App Info
  APP_NAME: 'HyperLocal Delivery',
  APP_TAGLINE: 'Groceries & essentials in 10 minutes',
  APP_VERSION: '1.0.0',

  // Supabase
  SUPABASE_URL: 'https://tslixztsblshlzsqmaoy.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGl4enRzYmxzaGx6c3FtYW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTA0NTQsImV4cCI6MjA5ODM4NjQ1NH0.cfAmvynfWvrWDTwCjOPKW-xAwAwaABL0SG77LpcZHsg',

  // Google Maps — Replace with your API key
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

  // Default Location (Bangalore, India)
  DEFAULT_LOCATION: {
    lat: 12.9716,
    lng: 77.5946,
    name: 'Bangalore'
  },

  // Delivery
  DELIVERY_CHARGE: 25,
  FREE_DELIVERY_ABOVE: 199,
  PLATFORM_FEE: 5,
  ESTIMATED_DELIVERY_MINS: 10,

  // Currency
  CURRENCY: '₹',
  CURRENCY_CODE: 'INR',

  // Categories with icons
  CATEGORIES: [
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#2ECC71' },
    { id: 'fruits', name: 'Fruits & Veggies', icon: '🍎', color: '#E74C3C' },
    { id: 'dairy', name: 'Dairy & Bread', icon: '🥛', color: '#3498DB' },
    { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#F39C12' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#9B59B6' },
    { id: 'meat', name: 'Meat & Fish', icon: '🥩', color: '#E67E22' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: '#1ABC9C' },
    { id: 'household', name: 'Household', icon: '🏠', color: '#34495E' },
    { id: 'baby', name: 'Baby Care', icon: '👶', color: '#E91E63' },
    { id: 'personal', name: 'Personal Care', icon: '🧴', color: '#00BCD4' },
    { id: 'frozen', name: 'Frozen Foods', icon: '🧊', color: '#607D8B' },
    { id: 'bakery', name: 'Bakery', icon: '🍞', color: '#795548' }
  ],

  // Demo Stores
  DEMO_STORES: [
    {
      id: 's1',
      name: 'FreshMart Express',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=200&fit=crop',
      rating: 4.5,
      deliveryTime: '8-12 min',
      distance: '1.2 km',
      tags: ['Groceries', 'Fruits', 'Dairy'],
      isOpen: true,
      discount: '20% OFF'
    },
    {
      id: 's2',
      name: 'QuickBite Foods',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      rating: 4.3,
      deliveryTime: '10-15 min',
      distance: '0.8 km',
      tags: ['Snacks', 'Beverages', 'Ready to eat'],
      isOpen: true,
      discount: null
    },
    {
      id: 's3',
      name: 'MediCare Pharmacy',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop',
      rating: 4.7,
      deliveryTime: '15-20 min',
      distance: '2.1 km',
      tags: ['Medicines', 'Health', 'Wellness'],
      isOpen: true,
      discount: '15% OFF'
    },
    {
      id: 's4',
      name: 'Daily Basket',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop',
      rating: 4.1,
      deliveryTime: '12-18 min',
      distance: '1.5 km',
      tags: ['Groceries', 'Household', 'Personal'],
      isOpen: true,
      discount: 'Free Delivery'
    },
    {
      id: 's5',
      name: 'Green Organic Store',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=200&fit=crop',
      rating: 4.8,
      deliveryTime: '10-15 min',
      distance: '0.5 km',
      tags: ['Organic', 'Fruits', 'Vegetables'],
      isOpen: true,
      discount: '10% OFF'
    }
  ],

  // Demo Products
  DEMO_PRODUCTS: [
    { id: 'p1', storeId: 's1', category: 'fruits', name: 'Fresh Bananas', weight: '1 dozen', price: 45, originalPrice: 55, discount: 18, image: '🍌', inStock: true },
    { id: 'p2', storeId: 's1', category: 'fruits', name: 'Red Apples', weight: '1 kg', price: 180, originalPrice: 220, discount: 18, image: '🍎', inStock: true },
    { id: 'p3', storeId: 's1', category: 'dairy', name: 'Amul Toned Milk', weight: '1 Litre', price: 54, originalPrice: 58, discount: 7, image: '🥛', inStock: true },
    { id: 'p4', storeId: 's1', category: 'dairy', name: 'Amul Butter', weight: '500g', price: 260, originalPrice: 280, discount: 7, image: '🧈', inStock: true },
    { id: 'p5', storeId: 's1', category: 'groceries', name: 'Basmati Rice', weight: '5 kg', price: 399, originalPrice: 499, discount: 20, image: '🍚', inStock: true },
    { id: 'p6', storeId: 's1', category: 'groceries', name: 'Toor Dal', weight: '1 kg', price: 145, originalPrice: 170, discount: 15, image: '🫘', inStock: true },
    { id: 'p7', storeId: 's2', category: 'snacks', name: "Lay's Classic Salted", weight: '150g', price: 30, originalPrice: 40, discount: 25, image: '🥔', inStock: true },
    { id: 'p8', storeId: 's2', category: 'snacks', name: 'Oreo Cookies', weight: '300g', price: 45, originalPrice: 50, discount: 10, image: '🍪', inStock: true },
    { id: 'p9', storeId: 's2', category: 'beverages', name: 'Coca-Cola', weight: '750ml', price: 38, originalPrice: 42, discount: 10, image: '🥤', inStock: true },
    { id: 'p10', storeId: 's2', category: 'beverages', name: 'Green Tea', weight: '100 bags', price: 180, originalPrice: 250, discount: 28, image: '🍵', inStock: true },
    { id: 'p11', storeId: 's3', category: 'pharmacy', name: 'Dolo 650mg', weight: '15 tablets', price: 30, originalPrice: 33, discount: 9, image: '💊', inStock: true },
    { id: 'p12', storeId: 's3', category: 'pharmacy', name: 'Crocin Advance', weight: '20 tablets', price: 25, originalPrice: 28, discount: 11, image: '💊', inStock: true },
    { id: 'p13', storeId: 's4', category: 'household', name: 'Surf Excel Matic', weight: '2 kg', price: 399, originalPrice: 450, discount: 11, image: '🧺', inStock: true },
    { id: 'p14', storeId: 's4', category: 'personal', name: 'Dove Soap', weight: '4 pack', price: 199, originalPrice: 240, discount: 17, image: '🧼', inStock: true },
    { id: 'p15', storeId: 's5', category: 'fruits', name: 'Organic Tomatoes', weight: '500g', price: 40, originalPrice: 55, discount: 27, image: '🍅', inStock: true },
    { id: 'p16', storeId: 's5', category: 'fruits', name: 'Fresh Spinach', weight: '250g', price: 25, originalPrice: 30, discount: 17, image: '🥬', inStock: true },
    { id: 'p17', storeId: 's1', category: 'bakery', name: 'Whole Wheat Bread', weight: '400g', price: 45, originalPrice: 55, discount: 18, image: '🍞', inStock: true },
    { id: 'p18', storeId: 's1', category: 'frozen', name: 'Frozen Peas', weight: '1 kg', price: 130, originalPrice: 160, discount: 19, image: '🧊', inStock: true },
    { id: 'p19', storeId: 's4', category: 'baby', name: 'Baby Diapers', weight: '40 pcs', price: 699, originalPrice: 799, discount: 13, image: '👶', inStock: true },
    { id: 'p20', storeId: 's2', category: 'meat', name: 'Chicken Breast', weight: '500g', price: 200, originalPrice: 250, discount: 20, image: '🍗', inStock: true },
    { id: 'p21', storeId: 's1', category: 'fruits', name: 'Fresh Mangoes', weight: '1 kg', price: 120, originalPrice: 150, discount: 20, image: '🥭', inStock: true },
    { id: 'p22', storeId: 's1', category: 'dairy', name: 'Paneer', weight: '200g', price: 80, originalPrice: 95, discount: 16, image: '🧀', inStock: true },
    { id: 'p23', storeId: 's2', category: 'snacks', name: 'Kurkure Masala', weight: '100g', price: 20, originalPrice: 25, discount: 20, image: '🌶️', inStock: true },
    { id: 'p24', storeId: 's5', category: 'fruits', name: 'Fresh Oranges', weight: '1 kg', price: 80, originalPrice: 100, discount: 20, image: '🍊', inStock: true },
  ],

  // Demo Offers
  DEMO_OFFERS: [
    {
      id: 'o1',
      discount: '50% OFF',
      title: 'On First Order',
      subtitle: 'Use code: FIRST50',
      code: 'FIRST50',
      gradient: 'gradient-1'
    },
    {
      id: 'o2',
      discount: '₹100 OFF',
      title: 'Grocery Shopping',
      subtitle: 'Min order ₹500',
      code: 'GROCERY100',
      gradient: 'gradient-2'
    },
    {
      id: 'o3',
      discount: 'FREE',
      title: 'Delivery on orders',
      subtitle: 'Above ₹199',
      code: 'FREEDEL',
      gradient: 'gradient-3'
    },
    {
      id: 'o4',
      discount: '30% OFF',
      title: 'Fresh Fruits',
      subtitle: 'Weekend Special',
      code: 'FRESH30',
      gradient: 'gradient-4'
    }
  ]
};
