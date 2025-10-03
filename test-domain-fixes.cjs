// Test the specific problematic ideas that were falling back to generic tech
const https = require('https');

const problematicIdeas = [
  {
    idea: "meditation app",
    expected: "Should get meditation/mindfulness/health subreddits",
    expectedSubs: ["Meditation", "mindfulness", "getmotivated", "fitness"]
  },
  {
    idea: "Social platform for pet owners",
    expected: "Should get pet subreddits, not marketing",
    expectedSubs: ["dogs", "cats", "pets", "DogTraining"]
  },
  {
    idea: "Music collaboration platform with AI composition tools",
    expected: "Should get music subreddits, not generic tech",
    expectedSubs: ["WeAreTheMusicMakers", "edmproduction", "musicians"]
  },
  {
    idea: "Digital art marketplace for independent artists",
    expected: "Should get art subreddits, not generic tech",
    expectedSubs: ["Art", "learnart", "ArtCrit", "painting"]
  }
];

async function testProblematicIdea(testData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ idea: testData.idea });
    
    const options = {
      hostname: 'ideavoyage-dwxc6fr8e-surendhars-projects-15fcb9f7.vercel.app',
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

async function testDomainFixes() {
  console.log('🔧 Testing Domain-Specific Detection Fixes\n');
  
  for (let i = 0; i < problematicIdeas.length; i++) {
    const test = problematicIdeas[i];
    console.log(`\n🎯 Test ${i + 1}/${problematicIdeas.length}: ${test.expected}`);
    console.log(`💡 Idea: "${test.idea}"`);
    
    try {
      const { result } = await testProblematicIdea(test);
      
      const subreddits = result.subreddits || [];
      const realPosts = result.evidence?.real_post_count || 0;
      
      console.log(`📍 Got subreddits: [${subreddits.slice(0, 4).join(', ')}${subreddits.length > 4 ? '...' : ''}]`);
      console.log(`🔍 Real Reddit posts: ${realPosts}`);
      
      // Check if we got the expected domain-specific subreddits
      const hasExpectedDomain = test.expectedSubs.some(expected => 
        subreddits.some(sub => sub.toLowerCase().includes(expected.toLowerCase()))
      );
      
      // Check if we're still getting generic tech subreddits
      const genericTechSubs = ['technology', 'webdev', 'programming', 'SaaS'];
      const hasGenericTech = subreddits.some(sub => genericTechSubs.includes(sub));
      
      if (hasExpectedDomain && !hasGenericTech) {
        console.log('✅ PERFECT! Got domain-specific subreddits, no generic tech');
      } else if (hasExpectedDomain && hasGenericTech) {
        console.log('⚠️  IMPROVED! Got domain subreddits but still some generic tech');
      } else if (hasGenericTech && !hasExpectedDomain) {
        console.log('❌ STILL BROKEN! Getting generic tech instead of domain-specific');
      } else {
        console.log('🤷 UNCLEAR! Got different subreddits entirely');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testDomainFixes().catch(console.error);