// Test with the exact user idea
const https = require('https');

const testIdea = "designer todo list";

console.log('🧪 Testing live API with idea:', testIdea);

const postData = JSON.stringify({
  idea: testIdea
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
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
      console.log('\n📊 Analysis Result:');
      console.log('Source:', result.source);
      console.log('Subreddits used:', result.redditData?.subreddits || 'No Reddit data');
      console.log('Status:', result.status);
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  console.log('💡 Make sure local dev server is running: npm run dev');
});

req.write(postData);
req.end();