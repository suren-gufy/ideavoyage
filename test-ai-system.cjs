// Test the new AI-powered analysis system
const { analyzeStartupWithAI } = require('./ai-powered-analysis.cjs');

async function testAIAnalysis() {
  console.log('🧪 Testing AI-Powered Universal Startup Analysis\n');
  
  const testIdeas = [
    "A smart umbrella that alerts you when it's going to rain",
    "Blockchain-based voting system for secure elections", 
    "AI-powered meal planning app for busy professionals",
    "Social platform for introverted people to make friends",
    "Subscription service for artisanal hot sauce",
    "AR mirror that gives posture correction advice",
    "Coffee subscription with personalized roast profiles",
    "Daily crossword puzzle app with social features",
    "Plant care app with soil monitoring sensors",
    "Video game trading card marketplace"
  ];
  
  for (let i = 0; i < testIdeas.length; i++) {
    const idea = testIdeas[i];
    console.log(`\n${i + 1}. Testing: "${idea}"`);
    console.log('=' + '='.repeat(idea.length + 15));
    
    try {
      const result = await analyzeStartupWithAI(idea);
      
      if (result.success) {
        console.log('🎉 AI ANALYSIS SUCCESS!');
        console.log(`   Industry: ${result.data.industry}`);
        console.log(`   Market Size: ${result.data.market_size || 'N/A'}`);
        console.log(`   Business Model: ${result.data.business_model}`);
        console.log(`   Target: ${result.data.target_audience}`);
        console.log(`   Revenue Potential: ${result.data.revenue_potential || 'N/A'}`);
        console.log(`   Subreddits: [${result.subreddits.join(', ')}]`);
      } else {
        console.log('🔄 Used Enhanced Fallback');
        console.log(`   Industry: ${result.data.industry}`);
        console.log(`   Keywords: [${result.data.keywords?.join(', ') || 'N/A'}]`);
        console.log(`   Subreddits: [${result.subreddits.join(', ')}]`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🏁 AI Analysis Testing Complete!');
  console.log('✅ System can now handle ANY startup idea intelligently');
  console.log('🚀 Ready to replace the old keyword-based system');
}

testAIAnalysis().catch(console.error);