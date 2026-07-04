const { createClient } = require('@supabase/supabase-js');
const url = 'https://tslixztsblshlzsqmaoy.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGl4enRzYmxzaGx6c3FtYW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTA0NTQsImV4cCI6MjA5ODM4NjQ1NH0.cfAmvynfWvrWDTwCjOPKW-xAwAwaABL0SG77LpcZHsg';
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error fetching orders:', error.message);
  } else {
    console.log('Orders table exists. Data:', data);
  }
}
test();
