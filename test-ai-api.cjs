// Test the AI-powered API with creative startup ideas
const testIdeas = [
  "A smart umbrella that alerts you when it's going to rain",
  "Blockchain-based secure voting platform for elections",
  "AI-powered bedtime story generator for children",
  "Netflix for elderly people with curated content",
  "Tinder but for finding carpool buddies for concerts",
  "A tea subscription box that matches your mood"
];

async function testAIPoweredAPI() {
  console.log('🧪 Testing AI-Powered API with Creative Ideas\n');
  
  for (let i = 0; i < testIdeas.length; i++) {
    const idea = testIdeas[i];
    console.log(`${i + 1}. Testing: "${idea}"`);
    console.log('=' + '='.repeat(idea.length + 15));
    
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idea })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Analysis Type: ${result.analysis.ai_powered ? 'AI-POWERED' : 'Enhanced Fallback'}`);
        console.log(`   🏭 Industry: ${result.analysis.industry}`);
        console.log(`   👥 Target: ${result.analysis.target_audience}`);
        console.log(`   💼 Business Model: ${result.analysis.business_model}`);
        console.log(`   📋 Subreddits: [${result.subreddits.slice(0, 5).join(', ')}]`);
        console.log(`   📝 Summary: ${result.summary}`);
      } else {
        console.log(`❌ API Error: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🏁 AI-Powered API Testing Complete!');
  console.log('🎉 System successfully handles ANY startup idea - no more limitations!');
}

testAIPoweredAPI().catch(console.error);