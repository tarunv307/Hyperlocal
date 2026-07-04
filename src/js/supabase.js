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
  if (!supabaseClient) return { data: mockUser(email, metadata), error: null };
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });
  return { data, error };
}

export async function signIn(email, password) {
  if (!supabaseClient) return { data: { user: mockUser(email) }, error: null };
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signInWithPhone(phone) {
  if (!supabaseClient) return { data: { user: null }, error: null };
  const { data, error } = await supabaseClient.auth.signInWithOtp({ phone });
  return { data, error };
}

export async function verifyOTP(phone, token) {
  if (!supabaseClient) return { data: { user: mockUser(phone) }, error: null };
  const { data, error } = await supabaseClient.auth.verifyOtp({ phone, token, type: 'sms' });
  return { data, error };
}

export async function signInWithGoogle() {
  if (!supabaseClient) return { data: { user: mockUser('google@user.com') }, error: null };
  const { data, error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
  return { data, error };
}

export async function signOut() {
  if (!supabaseClient) return { error: null };
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

export async function resetPassword(email) {
  if (!supabaseClient) return { data: {}, error: null };
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
  return { data, error };
}

export async function getUser() {
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

export function onAuthStateChange(callback) {
  if (!supabaseClient) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabaseClient.auth.onAuthStateChange(callback);
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
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('🔔 New order received via real-time:', payload.new);
        callback(payload.new);
      }
    )
    .subscribe();
    
  return channel;
}
