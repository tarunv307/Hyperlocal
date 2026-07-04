const url = 'https://tslixztsblshlzsqmaoy.supabase.co/rest/v1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGl4enRzYmxzaGx6c3FtYW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTA0NTQsImV4cCI6MjA5ODM4NjQ1NH0.cfAmvynfWvrWDTwCjOPKW-xAwAwaABL0SG77LpcZHsg';
const headers = { 
  'apikey': key, 
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function testInsert() {
  const orderPayload = {
    id: 'ORD-TEST123',
    items: [{name: 'Test', price: 10, quantity: 1}],
    total: 100,
    status: 'pending',
    customer_id: 'Test User',
    delivery_address: 'Bangalore'
  };

  try {
    const res = await fetch(`${url}/orders`, { 
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload)
    });
    const text = await res.text();
    console.log('Insert Status:', res.status);
    console.log('Insert Response:', text);
  } catch(e) {
    console.error('Fetch error:', e);
  }
}
testInsert();
