// Test 2 specific niche ideas to see current pain point quality after niche targeting fix
const testIdeas = [
  {
    idea: "Smart collar for cats that tracks hunting behavior and prevents them from killing birds",
    expectedSubreddits: ["cats", "CatAdvice", "wildlifephotography"],
    expectedPainPoints: ["cats killing birds", "outdoor cat safety", "wildlife protection"]
  },
  {
    idea: "Virtual coworking space with body doubling for ADHD remote workers", 
    expectedSubreddits: ["ADHD", "productivity", "remotework"],
    expectedPainPoints: ["ADHD focus issues", "isolation working from home", "procrastination"]
  }
];

console.log('🎯 TESTING NICHE TARGETING IMPROVEMENTS');
console.log('After implementing niche-specific Reddit targeting, testing pain point quality\n');

async function testNicheImprovements() {
  for (const test of testIdeas) {
    console.log(`================================================================================`);
    console.log(`💡 Testing: ${test.idea.substring(0, 60)}...`);
    console.log(`🎯 Expected Subreddits: ${test.expectedSubreddits.join(', ')}`);
    console.log(`😤 Expected Pain Points: ${test.expectedPainPoints.join(', ')}\n`);
    
    try {
      const response = await fetch('https://idea-voyage.vercel.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: test.idea,
          country: 'United States',
          platform: 'web',
          fundingMethod: 'self-funded',
          timeRange: 'next 6 months'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check subreddit targeting first
      if (data.subreddits) {
        console.log(`🎯 SUBREDDITS FOUND: ${data.subreddits.join(', ')}`);
        const relevantMatches = test.expectedSubreddits.filter(expected =>
          data.subreddits.some(found => found.toLowerCase().includes(expected.toLowerCase()))
        );
        const precision = Math.round(relevantMatches.length/test.expectedSubreddits.length*100);
        console.log(`   Targeting Precision: ${relevantMatches.length}/${test.expectedSubreddits.length} (${precision}%)`);
        console.log(`   Status: ${precision >= 70 ? '✅ EXCELLENT' : precision >= 50 ? '⚠️ GOOD' : '❌ NEEDS WORK'}`);
      }
      
      // Check pain points
      if (data.pain_points && data.pain_points.length > 0) {
        console.log(`\n😤 PAIN POINTS FOUND: ${data.pain_points.length}`);
        
        data.pain_points.slice(0, 3).forEach((pain, i) => {
          console.log(`\n${i+1}. "${pain.title}"`);
          console.log(`   Frequency: ${pain.frequency}%, Urgency: ${pain.urgency}`);
          
          // Check relevance to expected pain points
          const isSpecific = test.expectedPainPoints.some(expected => 
            pain.title.toLowerCase().includes(expected.toLowerCase()) ||
            expected.toLowerCase().includes(pain.title.toLowerCase())
          );
          
          // Also check if it uses real user language vs business jargon
          const hasUserLanguage = /\b(my|I|we|can't|don't|won't|keeps|always|never)\b/i.test(pain.title);
          
          console.log(`   Specificity: ${isSpecific ? '✅ RELEVANT' : '❌ GENERIC'}`);
          console.log(`   Language: ${hasUserLanguage ? '✅ USER VOICE' : '⚠️ BUSINESS TERMS'}`);
          
          if (pain.examples && pain.examples.length > 0) {
            console.log(`   Example: "${pain.examples[0].substring(0, 80)}..."`);
          }
        });
      }
      
      // Check Reddit data quality
      if (data.evidence && data.evidence.sample_reddit_posts) {
        console.log(`\n📱 REDDIT POSTS: ${data.evidence.sample_reddit_posts.length} posts`);
        const relevantPosts = data.evidence.sample_reddit_posts.filter(post => 
          test.expectedSubreddits.some(expected => 
            post.subreddit && post.subreddit.toLowerCase().includes(expected.toLowerCase())
          )
        );
        console.log(`   From Target Communities: ${relevantPosts.length}/${data.evidence.sample_reddit_posts.length}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${test.idea.substring(0, 30)}...:`, error.message);
    }
    
    console.log(`\n⏳ Waiting 3 seconds before next test...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('📊 SUMMARY:');
  console.log('✅ Subreddit targeting should show 70%+ precision for niche ideas');
  console.log('🎯 Pain points should use user language and be specific to the community');  
  console.log('📱 Reddit posts should come from the targeted niche communities');
}

testNicheImprovements();