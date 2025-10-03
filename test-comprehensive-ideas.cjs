// Comprehensive test for universal idea analysis - ANY length, ANY sentence, ANY domain
const https = require('https');

const testIdeas = [
  // SHORT IDEAS (1-3 words)
  {
    idea: "meditation app",
    expectedDomains: ["health", "wellness", "meditation"],
    expectedSubs: ["Meditation", "mindfulness", "getmotivated"],
    description: "Short wellness idea"
  },
  {
    idea: "crypto trading",
    expectedDomains: ["crypto", "trading", "CryptoCurrency"],
    expectedSubs: ["CryptoCurrency", "CryptoMarkets", "Bitcoin"],
    description: "Short crypto idea"
  },
  
  // MEDIUM IDEAS (5-10 words)
  {
    idea: "AI-powered fitness tracker for seniors",
    expectedDomains: ["fitness", "health", "seniors"],
    expectedSubs: ["fitness", "loseit", "HealthyFood"],
    description: "Medium AI + health idea"
  },
  {
    idea: "Social platform for pet owners",
    expectedDomains: ["social", "pets", "community"],
    expectedSubs: ["dogs", "cats", "pets"],
    description: "Medium social + pets idea"
  },
  
  // LONG IDEAS (15+ words)
  {
    idea: "A comprehensive project management tool specifically designed for remote teams working on software development projects with integrated video calling and real-time collaboration features",
    expectedDomains: ["productivity", "software", "remote"],
    expectedSubs: ["productivity", "remotework", "webdev"],
    description: "Long productivity + tech idea"
  },
  {
    idea: "An educational platform that helps high school students prepare for college entrance exams through personalized study plans, practice tests, and AI-powered tutoring sessions",
    expectedDomains: ["education", "students", "AI"],
    expectedSubs: ["GetStudying", "studytips", "education"],
    description: "Long education + AI idea"
  },
  
  // CASUAL/CONVERSATIONAL IDEAS
  {
    idea: "I want to build something that helps people find good restaurants nearby",
    expectedDomains: ["food", "restaurants", "local"],
    expectedSubs: ["Cooking", "food", "recipes"],
    description: "Conversational food idea"
  },
  {
    idea: "What if we made an app where gamers can find teammates",
    expectedDomains: ["gaming", "social", "community"],
    expectedSubs: ["gamedev", "gaming", "IndieGaming"],
    description: "Conversational gaming idea"
  },
  
  // TECHNICAL/SPECIFIC IDEAS
  {
    idea: "Blockchain-based supply chain tracking system for pharmaceutical companies",
    expectedDomains: ["blockchain", "medical", "enterprise"],
    expectedSubs: ["CryptoCurrency", "medicine", "healthcare"],
    description: "Technical blockchain + medical"
  },
  {
    idea: "Machine learning model for predicting real estate prices",
    expectedDomains: ["AI", "real estate", "prediction"],
    expectedSubs: ["MachineLearning", "RealEstate", "realestateinvesting"],
    description: "Technical ML + real estate"
  },
  
  // CREATIVE/ARTISTIC IDEAS
  {
    idea: "Digital art marketplace for independent artists",
    expectedDomains: ["art", "marketplace", "creative"],
    expectedSubs: ["Art", "learnart", "ecommerce"],
    description: "Creative art + marketplace"
  },
  {
    idea: "Music collaboration platform with AI composition tools",
    expectedDomains: ["music", "AI", "collaboration"],
    expectedSubs: ["WeAreTheMusicMakers", "edmproduction", "musicians"],
    description: "Creative music + AI"
  },
  
  // BUSINESS/FINANCE IDEAS  
  {
    idea: "Automated accounting software for small businesses",
    expectedDomains: ["finance", "accounting", "business"],
    expectedSubs: ["personalfinance", "Entrepreneur", "smallbusiness"],
    description: "Business finance idea"
  },
  {
    idea: "Investment portfolio tracker with tax optimization",
    expectedDomains: ["finance", "investment", "tax"],
    expectedSubs: ["investing", "personalfinance", "SecurityAnalysis"],
    description: "Finance + investment idea"
  },
  
  // LIFESTYLE/PERSONAL IDEAS
  {
    idea: "Dating app for book lovers who want to discuss literature",
    expectedDomains: ["social", "dating", "books"],
    expectedSubs: ["dating", "books", "literature"],
    description: "Lifestyle + books idea"
  },
  {
    idea: "Parenting app that tracks child development milestones",
    expectedDomains: ["parenting", "children", "health"],
    expectedSubs: ["Parenting", "NewParents", "Mommit"],
    description: "Parenting + tracking idea"
  }
];

async function testIdea(testData, hostname) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ idea: testData.idea });
    
    const options = {
      hostname: hostname,
      port: 443,
      path: '/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ testData, result });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE UNIVERSAL ANALYSIS TEST');
  console.log('Testing ANY length, ANY sentence, ANY domain startup ideas!\n');
  
  const hostname = 'ideavoyage-dwxc6fr8e-surendhars-projects-15fcb9f7.vercel.app';
  let totalTests = testIdeas.length;
  let successCount = 0;
  let results = [];

  for (let i = 0; i < testIdeas.length; i++) {
    const test = testIdeas[i];
    console.log(`\n🎯 Test ${i + 1}/${totalTests}: ${test.description}`);
    console.log(`💡 Idea: "${test.idea}"`);
    console.log(`📝 Length: ${test.idea.length} characters, ${test.idea.split(' ').length} words`);
    
    try {
      const { result } = await testIdea(test, hostname);
      
      const subreddits = result.subreddits || [];
      const realPosts = result.evidence?.real_post_count || 0;
      const painPoints = result.pain_points || [];
      
      console.log(`📍 Got subreddits: [${subreddits.slice(0, 4).join(', ')}${subreddits.length > 4 ? '...' : ''}]`);
      console.log(`🔍 Real Reddit posts: ${realPosts}`);
      console.log(`📊 Pain points: ${painPoints.length}`);
      
      // Check relevance - if ANY expected domain appears in subreddits
      const hasRelevant = test.expectedDomains.some(domain => 
        subreddits.some(sub => 
          sub.toLowerCase().includes(domain.toLowerCase()) || 
          domain.toLowerCase().includes(sub.toLowerCase()) ||
          test.expectedSubs.includes(sub)
        )
      );
      
      if (hasRelevant || realPosts > 0) {
        console.log('✅ SUCCESS - Got relevant communities and/or real posts!');
        successCount++;
        results.push({ ...test, status: 'SUCCESS', subreddits, realPosts });
      } else {
        console.log(`❌ FAILED - Expected domains: [${test.expectedDomains.join(', ')}]`);
        console.log(`   Expected subs: [${test.expectedSubs.join(', ')}]`);
        results.push({ ...test, status: 'FAILED', subreddits, realPosts });
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({ ...test, status: 'ERROR', error: error.message });
    }
  }

  // Final comprehensive results
  console.log(`\n\n🏆 COMPREHENSIVE TEST RESULTS:`);
  console.log(`✅ Successful: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
  console.log(`❌ Failed: ${totalTests - successCount}/${totalTests}`);
  
  console.log(`\n📊 BREAKDOWN BY CATEGORY:`);
  const categories = {
    'Short (1-3 words)': results.slice(0, 2),
    'Medium (5-10 words)': results.slice(2, 4), 
    'Long (15+ words)': results.slice(4, 6),
    'Conversational': results.slice(6, 8),
    'Technical': results.slice(8, 10),
    'Creative': results.slice(10, 12),
    'Business': results.slice(12, 14),
    'Lifestyle': results.slice(14, 16)
  };
  
  for (const [category, categoryResults] of Object.entries(categories)) {
    const categorySuccessCount = categoryResults.filter(r => r.status === 'SUCCESS').length;
    const categoryTotal = categoryResults.length;
    console.log(`${category}: ${categorySuccessCount}/${categoryTotal} (${Math.round(categorySuccessCount/categoryTotal*100)}%)`);
  }
  
  if (successCount >= totalTests * 0.9) {
    console.log(`\n🎉 EXCELLENT! System handles 90%+ of ANY idea types and lengths!`);
  } else if (successCount >= totalTests * 0.8) {
    console.log(`\n👍 VERY GOOD! System handles 80%+ of diverse ideas!`);
  } else if (successCount >= totalTests * 0.7) {
    console.log(`\n✅ GOOD! System handles 70%+ but could use some improvements`);
  } else {
    console.log(`\n⚠️  NEEDS WORK! System struggling with diverse idea types`);
  }
  
  console.log(`\n🔍 FAILED IDEAS THAT NEED ATTENTION:`);
  results.filter(r => r.status === 'FAILED').forEach(r => {
    console.log(`❌ "${r.idea}" - Got: [${r.subreddits.slice(0, 3).join(', ')}]`);
  });
}

runComprehensiveTest().catch(console.error);