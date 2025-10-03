// Test with a simple idea to see detailed error logs
import https from 'https';

const testIdea = "designer todo list";

console.log('🔍 Testing Perplexity integration with simple idea...');

const postData = JSON.stringify({
  idea: testIdea
});

const options = {
  hostname: 'ideavoyage-95wvu1qgl-surendhars-projects-15fcb9f7.vercel.app',
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
      
      console.log('\n=== DEPLOYMENT TEST ===');
      console.log('📊 Data source:', result.data_source);
      console.log('📊 Analysis confidence:', result.analysis_confidence);
      console.log('📊 Debug info:', result.debug);
      
      if (result.debug) {
        console.log('🔍 API version:', result.debug.api_version);
        console.log('🔍 Mode:', result.debug.mode);
        console.log('🔍 Perplexity available:', result.debug.perplexity_available);
        console.log('🔍 Enriched:', result.debug.enriched);
      }
      
      // Check if using new Perplexity integration
      if (result.debug?.api_version?.includes('perplexity')) {
        console.log('✅ New Perplexity version deployed successfully!');
      } else {
        console.log('❌ Still using old version - deployment issue');
      }
      
    } catch (e) {
      console.log('❌ Parse error:', e.message);
      console.log('Raw response first 1000 chars:', data.substring(0, 1000));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();