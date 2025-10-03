// Test intelligent subreddit selection for meal planning
const API_URL = 'https://ideavoyage-4ikph4l53-surendhars-projects-15fcb9f7.vercel.app/api';

async function testMealPlanningSubreddits() {
  console.log('🍽️ Testing meal planning idea for correct subreddit selection...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'meal planning tools for health goals' })
    });
    
    const data = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('🎯 Subreddits selected:', data.subreddits || []);
    console.log('🎯 Evidence subreddits:', data.evidence?.subreddits_used || []);
    console.log('💡 Keywords:', data.keywords?.slice(0, 5) || []);
    console.log('📝 Total posts analyzed:', data.total_posts_analyzed || 0);
    console.log('🔥 Real posts:', data.evidence?.real_post_count || 0);
    
    // Check if we got health-related subreddits
    const healthSubreddits = ['HealthyFood', 'nutrition', 'MealPrepSunday', 'EatCheapAndHealthy', 'loseit', 'fitness'];
    const selectedSubs = data.subreddits || [];
    const hasHealthSubs = healthSubreddits.some(sub => selectedSubs.includes(sub));
    
    console.log('\n📈 ANALYSIS:');
    console.log(`✅ Health-related subreddits found: ${hasHealthSubs ? 'YES' : 'NO'}`);
    if (hasHealthSubs) {
      const foundHealthSubs = selectedSubs.filter(sub => healthSubreddits.includes(sub));
      console.log(`🎉 Found relevant health communities: ${foundHealthSubs.join(', ')}`);
    }
    
    // Show sample posts to verify relevance
    if (data.evidence?.sample_reddit_posts?.length > 0) {
      console.log('\n📋 Sample Reddit discussions:');
      data.evidence.sample_reddit_posts.slice(0, 3).forEach((post, i) => {
        console.log(`${i+1}. r/${post.subreddit}: "${post.title}" (${post.score} upvotes)`);
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testMultipleIdeas() {
  console.log('🔬 Testing multiple ideas for smart subreddit selection...\n');
  
  const testCases = [
    { idea: 'meal planning tools for health goals', expectedType: 'health/nutrition' },
    { idea: 'AI-powered fitness tracker', expectedType: 'AI + fitness' }, 
    { idea: 'cryptocurrency trading bot', expectedType: 'finance/crypto' },
    { idea: 'UI design system for startups', expectedType: 'design' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: "${testCase.idea}" (expecting ${testCase.expectedType})`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: testCase.idea })
      });
      
      const data = await response.json();
      console.log(`🎯 Subreddits: ${(data.subreddits || []).slice(0, 4).join(', ')}`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed for "${testCase.idea}":`, error.message);
    }
  }
}

// Run the tests
testMealPlanningSubreddits().then(() => {
  console.log('\n' + '='.repeat(60));
  return testMultipleIdeas();
});