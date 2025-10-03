const https = require('https');

const API_URL = 'https://idea-voyage-git-main-pradeeps-projects-73b86e80.vercel.app/api';
const testIdea = "A smart umbrella that alerts you when it's going to rain";

console.log('🧪 Testing single idea:', testIdea);
console.log('📡 API URL:', API_URL);

const postData = JSON.stringify({ 
  idea: testIdea,
  analysisType: 'reddit_plus_ai' 
});

console.log('📤 Request payload:', postData);

const urlObj = new URL(API_URL);

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || 443,
  path: urlObj.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📋 Request options:', options);

const req = https.request(options, (res) => {
  console.log('📊 Status Code:', res.statusCode);
  console.log('📋 Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    console.log('📥 Data chunk received:', chunk.length, 'bytes');
  });
  
  res.on('end', () => {
    console.log('✅ Response complete');
    console.log('📝 Raw response:', data.substring(0, 500) + (data.length > 500 ? '...' : ''));
    
    try {
      const result = JSON.parse(data);
      console.log('🎯 Parsed result keys:', Object.keys(result));
      if (result.success) {
        console.log('✅ SUCCESS! Analysis completed');
        console.log('📊 Subreddits found:', result.data?.selectedSubreddits?.length || 0);
        console.log('📝 Reddit posts:', result.data?.redditPosts?.length || 0);
      } else {
        console.log('❌ API returned error:', result.error);
      }
    } catch (e) {
      console.log('❌ JSON parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();

console.log('📤 Request sent...');