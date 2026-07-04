// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Supabase Client
// ═══════════════════════════════════════════════════════════

import { CONFIG } from './config.js';

let supabaseClient = null;

// Initialize Supabase
export function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      console.log('✅ Supabase client initialized');
      return supabaseClient;
    } catch (e) {
      console.warn('⚠️ Supabase initialization failed, running in demo mode:', e.message);
    }
  }
  console.log('ℹ️ Running in demo mode (no Supabase)');
  return null;
}

export function getSupabase() {
  return supabaseClient;
}

// ── Auth Functions ────────────────────────────────────────

export async function signUp(email, password, metadata = {}) {
  // Always mock auth for demo purposes
  return { data: mockUser(email, metadata), error: null };
}

export async function signIn(email, password) {
  // Always mock auth for demo purposes
  return { data: { user: mockUser(email) }, error: null };
}

export async function signInWithPhone(phone) {
  return { data: { user: mockUser(phone) }, error: null };
}

export async function verifyOTP(phone, token) {
  return { data: { user: mockUser(phone) }, error: null };
}

export async function signInWithGoogle() {
  return { data: { user: mockUser('google@user.com') }, error: null };
}

export async function signOut() {
  return { error: null };
}

export async function resetPassword(email) {
  return { data: {}, error: null };
}

export async function getUser() {
  return null;
}

export function onAuthStateChange(callback) {
  return { data: { subscription: { unsubscribe: () => {} } } };
}

// ── Database Functions ────────────────────────────────────

export async function fetchData(table, options = {}) {
  if (!supabaseClient) return { data: [], error: null };
  let query = supabaseClient.from(table).select(options.select || '*');
  if (options.filter) {
    for (const [key, value] of Object.entries(options.filter)) {
      query = query.eq(key, value);
    }
  }
  if (options.order) query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
  if (options.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  return { data, error };
}

export async function insertData(table, data) {
  if (!supabaseClient) return { data: [{ id: Date.now(), ...data }], error: null };
  const result = await supabaseClient.from(table).insert(data).select();
  return result;
}

export async function updateData(table, id, data) {
  if (!supabaseClient) return { data: [{ id, ...data }], error: null };
  const result = await supabaseClient.from(table).update(data).eq('id', id).select();
  return result;
}

export async function deleteData(table, id) {
  if (!supabaseClient) return { error: null };
  const { error } = await supabaseClient.from(table).delete().eq('id', id);
  return { error };
}

// ── Mock User ─────────────────────────────────────────────

function mockUser(email, metadata = {}) {
  return {
    user: {
      id: 'demo-user-' + Date.now(),
      email: email,
      phone: metadata.phone || '',
      user_metadata: {
        full_name: metadata.full_name || 'Demo User',
        phone: metadata.phone || '+91 98765 43210',
        role: metadata.role || 'customer',
        ...metadata
      }
    }
  };
}

// ── Real-Time ─────────────────────────────────────────────

export function listenForNewOrders(callback) {
  if (!supabaseClient) {
    console.warn('⚠️ Supabase not initialized, cannot listen for real-time orders');
    return null;
  }
  
  console.log('📡 Starting real-time listener for orders table...');
  const channel = supabaseClient
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          console.log('🔔 New order received via real-time:', payload.new);
        } else if (payload.eventType === 'UPDATE') {
          console.log('🔄 Order updated via real-time:', payload.new);
        }
        callback(payload.new, payload.eventType);
      }
    )
    .subscribe();
    
  return channel;
}
