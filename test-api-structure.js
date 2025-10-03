// Detailed test to see what data is being returned from the API
import https from 'https';

const testIdea = "designer todo list";

console.log('🧪 Testing API response structure...');

const postData = JSON.stringify({
  idea: testIdea
});

const options = {
  hostname: 'ideavoyage-kzx6n5t8b-surendhars-projects-15fcb9f7.vercel.app',
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
      
      console.log('\n=== API RESPONSE ANALYSIS ===');
      console.log('📊 Data source:', result.data_source);
      console.log('📊 Analysis confidence:', result.analysis_confidence);
      console.log('📊 Has evidence object:', !!result.evidence);
      
      if (result.evidence) {
        console.log('📊 Real post count:', result.evidence.real_post_count);
        console.log('📊 Sample Reddit posts length:', result.evidence.sample_reddit_posts?.length || 0);
        if (result.evidence.sample_reddit_posts?.length > 0) {
          console.log('📊 First post structure:', Object.keys(result.evidence.sample_reddit_posts[0]));
        }
      }
      
      console.log('\n=== AI ANALYSIS SECTIONS ===');
      console.log('🤖 Pain points:', !!result.pain_points, result.pain_points?.length || 0);
      console.log('🤖 App ideas:', !!result.app_ideas, result.app_ideas?.length || 0);
      console.log('🤖 Google trends:', !!result.google_trends, result.google_trends?.length || 0);
      console.log('🤖 ICP:', !!result.icp);
      console.log('🤖 Problem statements:', !!result.problem_statements, result.problem_statements?.length || 0);
      console.log('🤖 Financial risks:', !!result.financial_risks, result.financial_risks?.length || 0);
      console.log('🤖 Competitors:', !!result.competitors, result.competitors?.length || 0);
      console.log('🤖 Revenue models:', !!result.revenue_models, result.revenue_models?.length || 0);
      console.log('🤖 Sentiment data:', !!result.sentiment_data);
      
      console.log('\n=== SAMPLE DATA ===');
      if (result.pain_points?.length > 0) {
        console.log('Pain point example:', result.pain_points[0]);
      }
      if (result.app_ideas?.length > 0) {
        console.log('App idea example:', result.app_ideas[0]);
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