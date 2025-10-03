// Test comprehensive subreddit detection for ANY type of idea
const API_URL = 'https://ideavoyage-ms79ftwfa-surendhars-projects-15fcb9f7.vercel.app/api';

async function testComprehensiveSubredditDetection() {
  console.log('🎯 Testing comprehensive subreddit detection for ANY idea type...\n');
  
  const testCases = [
    { idea: 'SEO backlink building tool for agencies', expected: 'SEO/Marketing' },
    { idea: 'meal planning app for busy parents', expected: 'Health/Food' },
    { idea: 'AI-powered fitness tracker', expected: 'AI/Fitness' },
    { idea: 'cryptocurrency trading bot', expected: 'Finance/Crypto' },
    { idea: 'pet grooming booking platform', expected: 'Pet/Booking' },
    { idea: 'music streaming analytics dashboard', expected: 'Music/Analytics' },
    { idea: 'travel itinerary planner', expected: 'Travel/Planning' },
    { idea: 'gaming tournament organizer', expected: 'Gaming/Sports' },
    { idea: 'legal document automation', expected: 'Legal/Automation' },
    { idea: 'automotive repair marketplace', expected: 'Automotive/Marketplace' },
    { idea: 'sustainable packaging solution', expected: 'Environment/Business' },
    { idea: 'random creative idea that doesnt fit anywhere', expected: 'Fallback' }
  ];
  
  for (const testCase of testCases) {
    console.log(`🔍 Testing: "${testCase.idea}"`);
    console.log(`📋 Expected category: ${testCase.expected}`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: testCase.idea })
      });
      
      const data = await response.json();
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`🎯 Selected subreddits: ${(data.subreddits || []).join(', ')}`);
      console.log(`📊 Data source: ${data.data_source || 'unknown'}`);
      console.log(`🔥 Real posts: ${data.evidence?.real_post_count || 0}`);
      
      // Check if subreddits are relevant to the idea
      const subreddits = data.subreddits || [];
      const ideaLower = testCase.idea.toLowerCase();
      
      let relevanceScore = 0;
      const relevantKeywords = {
        'seo': ['SEO', 'digitalmarketing', 'marketing'],
        'meal': ['HealthyFood', 'nutrition', 'MealPrepSunday'],
        'fitness': ['fitness', 'bodyweightfitness', 'loseit'],
        'crypto': ['financialindependence', 'investing', 'fintech'],
        'pet': ['dogs', 'cats', 'pets'],
        'music': ['WeAreTheMusicMakers', 'streaming'],
        'travel': ['travel', 'solotravel', 'digitalnomad'],
        'gaming': ['gamedev', 'gaming', 'IndieGaming'],
        'legal': ['legaladvice', 'law'],
        'automotive': ['cars', 'MechanicAdvice'],
        'sustainable': ['environment', 'sustainability']
      };
      
      for (const [keyword, expectedSubs] of Object.entries(relevantKeywords)) {
        if (ideaLower.includes(keyword)) {
          const hasRelevantSub = subreddits.some(sub => expectedSubs.includes(sub));
          if (hasRelevantSub) relevanceScore += 1;
          console.log(`🎯 ${keyword} relevance: ${hasRelevantSub ? 'YES' : 'NO'}`);
        }
      }
      
      console.log(`📈 Relevance score: ${relevanceScore > 0 ? 'HIGH' : 'NEEDS IMPROVEMENT'}`);
      console.log('─'.repeat(60));
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed for "${testCase.idea}":`, error.message);
      console.log('─'.repeat(60));
    }
  }
}

testComprehensiveSubredditDetection().then(() => {
  console.log('\n🎉 Comprehensive subreddit detection test completed!');
  console.log('✅ The system should now intelligently detect relevant communities for ANY idea type');
});