// Test direct API call to see actual error
const API_URL = 'https://ideavoyage-9qpd6wm90-surendhars-projects-15fcb9f7.vercel.app/api';

async function testWithErrorHandling() {
  console.log('🔍 Testing API with full error details...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ idea: 'designer todo list' })
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📊 Raw response (first 1000 chars):', text.substring(0, 1000));
    
    try {
      const data = JSON.parse(text);
      console.log('📊 Parsed response keys:', Object.keys(data));
      
      if (data.debug?.fallback === 'emergency') {
        console.log('❌ Emergency fallback triggered - there is an error in performRealAnalysis');
        console.log('🔍 Check server logs for the actual error');
      }
      
      if (data.error) {
        console.log('❌ API Error:', data.error);
        console.log('❌ Detail:', data.detail);
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testWithErrorHandling();