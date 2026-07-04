const url = 'https://tslixztsblshlzsqmaoy.supabase.co/rest/v1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGl4enRzYmxzaGx6c3FtYW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTA0NTQsImV4cCI6MjA5ODM4NjQ1NH0.cfAmvynfWvrWDTwCjOPKW-xAwAwaABL0SG77LpcZHsg';
const headers = { 'apikey': key, 'Authorization': `Bearer ${key}` };

async function check() {
  try {
    const pRes = await fetch(`${url}/products?select=*&limit=1`, { headers });
    const pData = await pRes.json();
    console.log('Products Table Status:', pRes.status, pData.message ? pData.message : 'EXISTS (Rows: ' + pData.length + ')');
    
    const sRes = await fetch(`${url}/stores?select=*&limit=1`, { headers });
    const sData = await sRes.json();
    console.log('Stores Table Status:', sRes.status, sData.message ? sData.message : 'EXISTS (Rows: ' + sData.length + ')');
    
    const oRes = await fetch(`${url}/orders?select=*&limit=1`, { headers });
    const oData = await oRes.json();
    console.log('Orders Table Status:', oRes.status, oData.message ? oData.message : 'EXISTS (Rows: ' + oData.length + ')');
  } catch(e) {
    console.error('Fetch error:', e);
  }
}
check();
