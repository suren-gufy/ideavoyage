// Test deployed API and show actual subreddits being returned
import https from 'https';

const testIdea = "designer todo list";

console.log('🧪 Testing deployed API with idea:', testIdea);

const postData = JSON.stringify({
  idea: testIdea
});

const options = {
  hostname: 'ideavoyage-e2lamqzfr-surendhars-projects-15fcb9f7.vercel.app',
  port: 443,
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
      console.log('\n📊 DEPLOYED API Results:');
      console.log('💡 Data source:', result.data_source);
      console.log('🎯 Subreddits returned:', result.subreddits);
      console.log('📈 Analysis confidence:', result.analysis_confidence);
      console.log('📝 Notes:', result.notes);
      
      if (result.subreddits) {
        console.log('\n🔍 Subreddit Details:');
        result.subreddits.forEach((sub, i) => {
          console.log(`${i+1}. r/${sub}`);
        });
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

req.write(postData);
req.end();