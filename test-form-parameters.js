// Test if frontend form parameters are working
const API_URL = 'https://ideavoyage-4ikph4l53-surendhars-projects-15fcb9f7.vercel.app/api';

async function testFormParameters() {
  console.log('🔍 Testing frontend form parameters...\n');
  
  const testCases = [
    {
      name: 'Basic idea only',
      payload: { 
        idea: 'meal planning app for busy parents' 
      }
    },
    {
      name: 'With target audience',
      payload: { 
        idea: 'meal planning app for busy parents',
        targetAudience: 'Busy parents with young children'
      }
    },
    {
      name: 'With industry',
      payload: { 
        idea: 'meal planning app for busy parents',
        industry: 'Health & Wellness'
      }
    },
    {
      name: 'With platform',
      payload: { 
        idea: 'meal planning app for busy parents',
        platform: 'Mobile App'
      }
    },
    {
      name: 'All parameters',
      payload: { 
        idea: 'meal planning app for busy parents',
        targetAudience: 'Busy parents with young children',
        industry: 'Health & Wellness',
        platform: 'Mobile App',
        country: 'United States',
        fundingMethod: 'venture-capital',
        timeRange: 'year'
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`📊 Testing: ${testCase.name}`);
    console.log(`📝 Payload:`, JSON.stringify(testCase.payload, null, 2));
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.payload)
      });
      
      const data = await response.json();
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`🎯 Subreddits: ${(data.subreddits || []).slice(0, 4).join(', ')}`);
      console.log(`💡 Keywords: ${(data.keywords || []).slice(0, 3).join(', ')}`);
      console.log(`📈 Pain points: ${data.pain_points?.length || 0}`);
      console.log(`🏢 Competitors: ${data.competitors?.length || 0}`);
      console.log(`📊 Data source: ${data.data_source || 'unknown'}`);
      
      // Check if target audience is reflected in analysis
      if (testCase.payload.targetAudience) {
        const hasTargetAudience = JSON.stringify(data).toLowerCase().includes('parent');
        console.log(`👥 Target audience reflected: ${hasTargetAudience ? 'YES' : 'NO'}`);
      }
      
      // Check if industry is reflected
      if (testCase.payload.industry) {
        const hasIndustry = JSON.stringify(data).toLowerCase().includes('health');
        console.log(`🏭 Industry reflected: ${hasIndustry ? 'YES' : 'NO'}`);
      }
      
      console.log('─'.repeat(50));
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Failed for "${testCase.name}":`, error.message);
      console.log('─'.repeat(50));
    }
  }
}

async function testSpecificFormFields() {
  console.log('\n🎯 Testing specific form field combinations...\n');
  
  // Test if different target audiences affect subreddit selection
  const audienceTests = [
    { idea: 'productivity app', targetAudience: 'College students', expectedSubs: ['GetStudying', 'college'] },
    { idea: 'productivity app', targetAudience: 'Remote workers', expectedSubs: ['remotework', 'digitalnomad'] },
    { idea: 'fitness app', targetAudience: 'New parents', expectedSubs: ['NewParents', 'Mommit'] }
  ];
  
  for (const test of audienceTests) {
    console.log(`👥 Testing: "${test.idea}" for "${test.targetAudience}"`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: test.idea, 
          targetAudience: test.targetAudience 
        })
      });
      
      const data = await response.json();
      console.log(`🎯 Selected subreddits: ${(data.subreddits || []).join(', ')}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed:`, error.message);
    }
  }
}

// Run tests
testFormParameters().then(() => {
  return testSpecificFormFields();
}).then(() => {
  console.log('\n✅ Form parameter testing completed!');
});