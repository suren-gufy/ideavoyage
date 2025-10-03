// Quick test to verify the exact scenario from the screenshot
const API_URL = 'https://ideavoyage-4ikph4l53-surendhars-projects-15fcb9f7.vercel.app/api';

async function testExactScenario() {
  console.log('🎯 Testing exact scenario from screenshot...\n');
  
  const payload = {
    idea: 'meal planning tools for health goals',
    targetAudience: 'Busy parents with young children',
    industry: 'Health & Wellness',
    platform: 'Web App',
    country: 'Global',
    fundingMethod: 'self-funded',
    timeRange: 'month'
  };
  
  console.log('📝 Testing with payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    console.log('\n📊 RESULTS:');
    console.log(`✅ Status: ${response.status}`);
    console.log(`🎯 Selected subreddits: ${(data.subreddits || []).join(', ')}`);
    console.log(`💡 Top keywords: ${(data.keywords || []).slice(0, 5).join(', ')}`);
    console.log(`📈 Pain points found: ${data.pain_points?.length || 0}`);
    console.log(`🏢 Competitors identified: ${data.competitors?.length || 0}`);
    console.log(`📊 Data source: ${data.data_source || 'unknown'}`);
    console.log(`🔥 Analysis confidence: ${data.analysis_confidence || 'unknown'}`);
    
    // Verify we're getting health-related content
    const healthKeywords = ['health', 'nutrition', 'meal', 'diet', 'food', 'healthy'];
    const hasHealthKeywords = (data.keywords || []).some(keyword => 
      healthKeywords.some(health => keyword.toLowerCase().includes(health))
    );
    
    console.log(`\n🏥 Health-related content: ${hasHealthKeywords ? 'YES ✅' : 'NO ❌'}`);
    
    // Check for parent-related content
    const parentKeywords = ['parent', 'family', 'children', 'busy'];
    const analysisText = JSON.stringify(data).toLowerCase();
    const hasParentContent = parentKeywords.some(keyword => analysisText.includes(keyword));
    
    console.log(`👨‍👩‍👧‍👦 Parent-focused content: ${hasParentContent ? 'YES ✅' : 'NO ❌'}`);
    
    // Show sample pain points
    if (data.pain_points?.length > 0) {
      console.log('\n⚡ Sample pain points:');
      data.pain_points.slice(0, 2).forEach((pain, i) => {
        console.log(`${i+1}. ${pain.title} (${pain.frequency}% frequency, ${pain.urgency} urgency)`);
      });
    }
    
    // Show Reddit discussions relevance
    if (data.evidence?.sample_reddit_posts?.length > 0) {
      console.log('\n💬 Sample Reddit discussions:');
      data.evidence.sample_reddit_posts.slice(0, 3).forEach((post, i) => {
        console.log(`${i+1}. r/${post.subreddit}: "${post.title}" (${post.score} upvotes)`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testExactScenario();