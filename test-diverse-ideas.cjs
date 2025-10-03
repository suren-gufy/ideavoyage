// Test multiple diverse ideas to verify universal analysis
const https = require('https');

const testIdeas = [
  {
    idea: "Pet grooming appointment booking system",
    expectedSubs: ["dogs", "cats", "pets"],
    description: "Pet service → Pet communities"
  },
  {
    idea: "Legal document automation for startups", 
    expectedSubs: ["legaladvice", "law"],
    description: "Legal tool → Legal communities"
  },
  {
    idea: "Sustainable energy monitoring dashboard",
    expectedSubs: ["environment", "sustainability", "renewable"],
    description: "Green tech → Environment communities"
  }
];

async function testIdea(testData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ idea: testData.idea });
    
    const options = {
      hostname: 'ideavoyage-eex8mplu6-surendhars-projects-15fcb9f7.vercel.app',
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

async function runTests() {
  console.log('🚀 Testing UNIVERSAL Analysis - Any idea should get relevant subreddits!\n');
  
  for (let i = 0; i < testIdeas.length; i++) {
    const test = testIdeas[i];
    console.log(`🎯 Test ${i + 1}/${testIdeas.length}: ${test.description}`);
    console.log(`💡 Idea: "${test.idea}"`);
    
    try {
      const { result } = await testIdea(test);
      
      const subreddits = result.subreddits || [];
      const realPosts = result.evidence?.real_post_count || 0;
      
      console.log(`📍 Got subreddits: [${subreddits.join(', ')}]`);
      console.log(`🔍 Real Reddit posts: ${realPosts}`);
      
      // Check relevance
      const hasRelevant = test.expectedSubs.some(expected => 
        subreddits.some(sub => sub.toLowerCase().includes(expected.toLowerCase()))
      );
      
      if (hasRelevant) {
        console.log('✅ SUCCESS - Got relevant communities!');
      } else {
        console.log(`❌ FAILED - Expected: [${test.expectedSubs.join(', ')}]`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Space between tests
  }
}

runTests();