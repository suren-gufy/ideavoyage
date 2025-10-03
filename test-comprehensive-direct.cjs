const { performRealAnalysis } = require('./api/index.ts');

async function testComprehensiveReport() {
  console.log('🏢 TESTING COMPREHENSIVE BUSINESS VALIDATION REPORT');
  console.log('=' .repeat(70));
  
  const testIdea = "AI-powered plant care assistant that monitors soil moisture and sends notifications";
  
  try {
    console.log('📋 Testing Idea:', testIdea);
    console.log('-'.repeat(70));
    
    const result = await performRealAnalysis(testIdea, 'reddit_plus_ai');
    
    if (result && result.analysis) {
      console.log('✅ COMPREHENSIVE BUSINESS REPORT GENERATED');
      console.log('📊 Type:', typeof result.analysis);
      
      if (typeof result.analysis === 'object') {
        const analysis = result.analysis;
        
        // Check for main sections
        console.log('\n🏢 BUSINESS OVERVIEW:');
        if (analysis.business_overview) {
          console.log('  ✅ Business Overview: Present');
          console.log('  💰 Monetization Strategies:', analysis.business_overview.monetization_strategies?.length || 0);
          console.log('  ⚠️  Risk Factors:', analysis.business_overview.potential_risks?.length || 0);
        } else {
          console.log('  ❌ Business Overview: Missing');
        }
        
        console.log('\n🎯 MARKET RESEARCH:');
        if (analysis.market_research) {
          console.log('  ✅ Market Research: Present');
          console.log('  🏢 Competitors:', analysis.market_research.competitive_analysis?.length || 0);
          console.log('  👥 Customer Segments:', analysis.market_research.customer_segments?.length || 0);
        } else {
          console.log('  ❌ Market Research: Missing');
        }
        
        console.log('\n🚀 LAUNCH STRATEGY:');
        if (analysis.launch_and_scale) {
          console.log('  ✅ Launch & Scale: Present');
          console.log('  ⏱️  MVP Roadmap:', analysis.launch_and_scale.mvp_roadmap?.length || 0);
          console.log('  🎨 Marketing Tactics:', analysis.launch_and_scale.guerrilla_marketing?.length || 0);
        } else {
          console.log('  ❌ Launch & Scale: Missing');
        }
        
        console.log('\n💰 CAPITAL RAISING:');
        if (analysis.capital_raising) {
          console.log('  ✅ Capital Raising: Present');
          console.log('  🎤 Elevator Pitch:', analysis.capital_raising.elevator_pitch ? 'Generated' : 'Missing');
          console.log('  📊 Funding Requirements:', analysis.capital_raising.funding_required ? 'Present' : 'Missing');
        } else {
          console.log('  ❌ Capital Raising: Missing');
        }
        
      } else {
        console.log('⚠️  Analysis is text format (not structured JSON)');
        console.log('📝 Preview:', result.analysis.substring(0, 500) + '...');
      }
      
      console.log('\n📱 ADDITIONAL DATA:');
      console.log('  🎯 Subreddits:', result.selectedSubreddits?.length || 0);
      console.log('  📊 Reddit Posts:', result.redditPosts?.length || 0);
      
    } else {
      console.log('❌ No analysis generated');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testComprehensiveReport().catch(console.error);