// Test UNIVERSAL analysis - ANY idea should get relevant subreddits
const testIdeas = [
  {
    idea: "A user-friendly crypto wallet for mainstream adoption",
    expectedTopics: ["crypto", "CryptoCurrency", "Bitcoin", "ethereum"],
    description: "Should get CRYPTO subreddits, not finance"
  },
  {
    idea: "AI-powered meal planning app for healthy families",
    expectedTopics: ["health", "AI", "HealthyFood", "MealPrepSunday"],
    description: "Should get health + AI subreddits"
  },
  {
    idea: "Social media platform for pet owners to share photos",
    expectedTopics: ["social", "pets", "dogs", "cats"],
    description: "Should get pet + social subreddits"
  },
  {
    idea: "Blockchain-based voting system for elections", 
    expectedTopics: ["crypto", "blockchain", "CryptoCurrency", "technology"],
    description: "Should get crypto + tech subreddits"
  },
  {
    idea: "Online marketplace for handmade crafts and art",
    expectedTopics: ["ecommerce", "art", "crafts", "marketplace"],
    description: "Should get art + ecommerce subreddits"
  },
  {
    idea: "Video game streaming platform with rewards",
    expectedTopics: ["gaming", "streaming", "gamedev"],
    description: "Should get gaming subreddits"
  },
  {
    idea: "Legal document automation for small businesses",
    expectedTopics: ["legal", "automation", "legaladvice"],
    description: "Should get legal subreddits"
  },
  {
    idea: "Medical appointment booking system",
    expectedTopics: ["medical", "healthcare", "booking"],
    description: "Should get medical subreddits"
  },
  {
    idea: "Sustainable energy dashboard for homeowners",
    expectedTopics: ["environment", "renewable", "sustainability"],
    description: "Should get environment subreddits"
  },
  {
    idea: "Real estate investment calculator app",
    expectedTopics: ["real estate", "investment", "RealEstate"],
    description: "Should get real estate subreddits"
  }
];

async function testUniversalAnalysis() {
  console.log('🚀 Testing UNIVERSAL analysis - every idea should get relevant subreddits!\n');
  
  const API_URL = 'https://ideavoyage-dwxc6fr8e-surendhars-projects-15fcb9f7.vercel.app/api';
  let successCount = 0;
  let totalTests = testIdeas.length;

  for (let i = 0; i < testIdeas.length; i++) {
    const test = testIdeas[i];
    console.log(`\n🎯 Test ${i + 1}/${totalTests}: ${test.description}`);
    console.log(`💡 Idea: "${test.idea}"`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: test.idea,
          analysisType: 'complete'
        })
      });

      const data = await response.json();

      if (data && data.subreddits) {
        const subreddits = data.subreddits || [];
        const painPoints = data.pain_points || [];
        const redditPosts = data.evidence?.sample_reddit_posts || [];

        console.log(`📍 Selected Subreddits: [${subreddits.join(', ')}]`);
        console.log(`📝 Pain Points Found: ${painPoints.length}`);
        console.log(`🔍 Reddit Posts: ${redditPosts.length}`);

        // Check if any expected topics appear in subreddits
        const relevantMatches = test.expectedTopics.filter(topic => 
          subreddits.some(sub => sub.toLowerCase().includes(topic.toLowerCase()) || 
                                topic.toLowerCase().includes(sub.toLowerCase()))
        );

        if (relevantMatches.length > 0) {
          console.log(`✅ RELEVANT - Found matches: [${relevantMatches.join(', ')}]`);
          successCount++;
        } else {
          console.log(`❌ IRRELEVANT - Expected topics: [${test.expectedTopics.join(', ')}]`);
          console.log(`   Got subreddits: [${subreddits.join(', ')}]`);
        }

        // Check if Reddit posts exist and are real
        if (redditPosts.length > 0) {
          console.log(`📊 Sample post: "${redditPosts[0].title || 'No title'}"`)
        } else {
          console.log(`⚠️  No Reddit posts found`);
        }

      } else {
        console.log('❌ No analysis data returned');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log(`\n🏆 UNIVERSAL ANALYSIS RESULTS:`);
  console.log(`✅ Successful: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
  console.log(`❌ Failed: ${totalTests - successCount}/${totalTests}`);
  
  if (successCount >= totalTests * 0.8) {
    console.log(`🎉 EXCELLENT! System handles 80%+ of ANY idea types!`);
  } else if (successCount >= totalTests * 0.6) {
    console.log(`👍 GOOD! System handles 60%+ of idea types, but needs improvement`);
  } else {
    console.log(`⚠️  NEEDS WORK! System failing on too many idea types`);
  }
}

testUniversalAnalysis().catch(console.error);