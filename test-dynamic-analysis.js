// Test the new DYNAMIC ANALYSIS system with diverse ideas
console.log('🚀 TESTING DYNAMIC SUBREDDIT DETECTION');
console.log('System should now analyze ANY idea and find relevant communities\n');

const diverseTestIdeas = [
  {
    idea: "App to help seniors with dementia remember to take medication",
    expectedDomains: ["health", "seniors"],
    expectedSubreddits: ["dementia", "Alzheimers", "CaregiverSupport", "eldercare"]
  },
  {
    idea: "Platform for freelance graphic designers to find clients", 
    expectedDomains: ["work", "artists"],
    expectedSubreddits: ["freelance", "graphic_design", "Design", "Art"]
  },
  {
    idea: "Smart garden sensor that detects plant diseases using AI",
    expectedDomains: ["plants", "tech"], 
    expectedSubreddits: ["houseplants", "gardening", "plantclinic", "MachineLearning"]
  },
  {
    idea: "Dating app specifically for introverted people",
    expectedDomains: ["social"],
    expectedSubreddits: ["dating_advice", "socialskills", "introvert"]
  },
  {
    idea: "Meal planning service for bodybuilders on a budget",
    expectedDomains: ["fitness", "food"],
    expectedSubreddits: ["bodybuilding", "MealPrepSunday", "nutrition", "fitness"]
  },
  {
    idea: "Virtual reality therapy for people with social anxiety",
    expectedDomains: ["health", "tech"],
    expectedSubreddits: ["socialanxiety", "mentalhealth", "therapy", "VirtualReality"]
  }
];

async function testDynamicAnalysis() {
  console.log(`Testing ${diverseTestIdeas.length} diverse ideas to validate dynamic detection...\n`);
  
  for (let i = 0; i < diverseTestIdeas.length; i++) {
    const test = diverseTestIdeas[i];
    console.log(`${'='.repeat(80)}`);
    console.log(`🧪 TEST ${i+1}/${diverseTestIdeas.length}: ${test.idea}`);
    console.log(`📍 Expected Domains: ${test.expectedDomains.join(', ')}`);
    console.log(`🎯 Expected Communities: ${test.expectedSubreddits.join(', ')}\n`);
    
    try {
      const startTime = Date.now();
      
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
      const analysisTime = Date.now() - startTime;
      
      // Test Subreddit Targeting
      if (data.subreddits && data.subreddits.length > 0) {
        console.log(`🎯 SUBREDDITS DETECTED: ${data.subreddits.join(', ')}`);
        
        // Check how many expected subreddits were found
        const foundExpected = test.expectedSubreddits.filter(expected =>
          data.subreddits.some(found => 
            found.toLowerCase().includes(expected.toLowerCase()) ||
            expected.toLowerCase().includes(found.toLowerCase())
          )
        );
        
        const precision = Math.round((foundExpected.length / test.expectedSubreddits.length) * 100);
        console.log(`   ✅ Precision: ${foundExpected.length}/${test.expectedSubreddits.length} (${precision}%)`);
        console.log(`   📍 Matched: [${foundExpected.join(', ')}]`);
        
        // Check if we avoided generic business subreddits
        const genericSubreddits = ['startups', 'Entrepreneur', 'business', 'smallbusiness'];
        const genericCount = data.subreddits.filter(sub => genericSubreddits.includes(sub)).length;
        const specificity = genericCount < data.subreddits.length / 2 ? '✅ SPECIFIC' : '⚠️ GENERIC';
        console.log(`   🎯 Specificity: ${specificity} (${genericCount}/${data.subreddits.length} generic)`);
      } else {
        console.log('❌ No subreddits detected');
      }
      
      // Test Pain Point Quality
      if (data.pain_points && data.pain_points.length > 0) {
        console.log(`\n😤 PAIN POINTS FOUND: ${data.pain_points.length}`);
        
        data.pain_points.slice(0, 2).forEach((pain, idx) => {
          console.log(`\n   ${idx+1}. "${pain.title}"`);
          console.log(`      Frequency: ${pain.frequency}%, Urgency: ${pain.urgency}`);
          
          // Check for user language vs business jargon
          const hasUserLanguage = /\\b(my|I|we|can't|don't|won't|keeps|always|never|hate|love|wish|need|want)\\b/i.test(pain.title);
          const languageQuality = hasUserLanguage ? '✅ USER VOICE' : '⚠️ BUSINESS TERMS';
          console.log(`      Language: ${languageQuality}`);
          
          if (pain.examples && pain.examples.length > 0) {
            console.log(`      Example: "${pain.examples[0].substring(0, 60)}..."`);
          }
        });
      }
      
      // Test Reddit Data Quality
      if (data.evidence && data.evidence.sample_reddit_posts) {
        console.log(`\n📱 REDDIT POSTS: ${data.evidence.sample_reddit_posts.length} posts analyzed`);
        
        const relevantPosts = data.evidence.sample_reddit_posts.filter(post =>
          test.expectedSubreddits.some(expected =>
            post.subreddit && post.subreddit.toLowerCase().includes(expected.toLowerCase())
          )
        );
        
        console.log(`   🎯 From Target Communities: ${relevantPosts.length}/${data.evidence.sample_reddit_posts.length}`);
        
        if (relevantPosts.length > 0) {
          console.log(`   📝 Sample: "${relevantPosts[0].title.substring(0, 50)}..." (r/${relevantPosts[0].subreddit})`);
        }
      }
      
      console.log(`\n⏱️  Analysis Time: ${analysisTime}ms`);
      console.log(`🏆 OVERALL: ${precision >= 70 ? '✅ EXCELLENT' : precision >= 50 ? '⚠️ GOOD' : '❌ NEEDS WORK'} targeting`);
      
    } catch (error) {
      console.error(`❌ Error testing "${test.idea.substring(0, 30)}...":`, error.message);
    }
    
    if (i < diverseTestIdeas.length - 1) {
      console.log(`\n⏳ Waiting 3 seconds before next test...\n`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 DYNAMIC ANALYSIS TEST SUMMARY:');
  console.log('✅ System should now handle ANY idea intelligently');
  console.log('🎯 Subreddits should be specific to the problem domain + audience');
  console.log('😤 Pain points should use exact user language from Reddit');
  console.log('📱 Reddit posts should come from relevant communities');
  console.log('🚀 No more rigid category limitations!');
}

testDynamicAnalysis();