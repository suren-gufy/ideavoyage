// Test with debug logs to see what's happening with OpenAI
import https from 'https';

const testIdea = "debug test for OpenAI integration";

console.log('🔍 Testing OpenAI integration debug...');

const postData = JSON.stringify({
  idea: testIdea
});

const options = {
  hostname: 'ideavoyage-r0bhwk3tq-surendhars-projects-15fcb9f7.vercel.app',
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
      
      console.log('\n=== DEBUG INFO ===');
      console.log('📊 Data source:', result.data_source);
      console.log('📊 Analysis confidence:', result.analysis_confidence);
      console.log('📊 Debug object:', result.debug);
      
      if (result.debug) {
        console.log('🔍 Debug mode:', result.debug.mode);
        console.log('🔍 OpenAI available:', result.debug.openai_available);
        console.log('🔍 Reddit OAuth used:', result.debug.reddit_oauth_used);
        console.log('🔍 Reddit creds available:', result.debug.reddit_creds_available);
        console.log('🔍 MS duration:', result.debug.ms);
      }
      
      // Check evidence for enrichment clues
      if (result.evidence) {
        console.log('\n=== EVIDENCE ===');
        console.log('📊 Real post count:', result.evidence.real_post_count);
        console.log('📊 Synthetic post count:', result.evidence.synthetic_post_count);
      }
      
      // Look for signs of OpenAI processing
      if (result.pain_points && result.pain_points.length > 2) {
        console.log('✅ Likely AI-processed (rich pain points)');
      } else {
        console.log('❌ Likely basic processing (minimal pain points)');
      }
      
    } catch (e) {
      console.log('❌ Parse error:', e.message);
      console.log('Raw response first 500 chars:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();