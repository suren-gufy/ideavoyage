// Test the API status endpoint to see if OpenAI is detected
import https from 'https';

console.log('🔍 Testing API status endpoint...');

const options = {
  hostname: 'ideavoyage-5s1szm8ue-surendhars-projects-15fcb9f7.vercel.app',
  port: 443,
  path: '/api',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n=== API STATUS CHECK ===');
      console.log('📊 Mode:', result.mode);
      console.log('📊 OpenAI available:', result.openai_available);
      console.log('📊 Reddit OAuth available:', result.reddit_oauth_available);
      console.log('📊 Environment key length:', result.env_key_length);
      console.log('📊 Environment key preview:', result.env_key_start);
      console.log('📊 Reddit client ID length:', result.reddit_client_id_length);
      console.log('📊 Reddit client secret length:', result.reddit_client_secret_length);
      console.log('📊 API version:', result.version);
      
      if (result.openai_available) {
        console.log('✅ OpenAI integration should work!');
      } else {
        console.log('❌ OpenAI not detected in deployed environment');
      }
      
    } catch (e) {
      console.log('❌ Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.end();