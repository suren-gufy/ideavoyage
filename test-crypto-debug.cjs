// Simple test for crypto wallet analysis with debug
const https = require('https');

const cryptoWalletIdea = "A user-friendly crypto wallet for mainstream adoption";

const data = JSON.stringify({
  idea: cryptoWalletIdea
});

const options = {
  hostname: 'ideavoyage-eex8mplu6-surendhars-projects-15fcb9f7.vercel.app',
  port: 443,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing crypto wallet idea...');
console.log(`💡 Idea: "${cryptoWalletIdea}"`);

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`📊 Response Status: ${res.statusCode}`);
    console.log(`📝 Response Length: ${responseData.length} chars`);
    
    try {
      const result = JSON.parse(responseData);
      console.log('\n🔍 FULL RESPONSE STRUCTURE:');
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response first 1000 chars:', responseData.substring(0, 1000));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();