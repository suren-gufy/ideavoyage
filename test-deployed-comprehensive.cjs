const fetch = require('node-fetch');

const API_URL = 'https://ideavoyage-i2z8xrg1f-surendhars-projects-15fcb9f7.vercel.app/api';

async function testComprehensiveBusinessValidation() {
  console.log('🏢 TESTING COMPREHENSIVE BUSINESS VALIDATION');
  console.log('=' .repeat(80));
  
  const testIdea = "AI-powered plant care assistant that monitors soil moisture and sends notifications to your phone when plants need water or care";
  
  console.log('📋 Testing Idea:', testIdea);
  console.log('🌐 API URL:', API_URL);
  console.log('-'.repeat(80));
  
  try {
    const startTime = Date.now();
    console.log('🔄 Making API request...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        idea: testIdea,
        analysisType: 'reddit_plus_ai',
        industry: 'Smart Home & IoT',
        targetAudience: 'Plant enthusiasts and busy professionals'
      }),
    });
    
    const duration = Date.now() - startTime;
    console.log(`⏱️  Request completed in ${duration}ms`);
    
    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error body:', errorText.substring(0, 500));
      return;
    }
    
    const result = await response.json();
    console.log('📥 Response received, parsing...');
    
    if (result.success && result.data) {
      console.log('✅ ANALYSIS COMPLETED SUCCESSFULLY');
      console.log('-'.repeat(80));
      
      // Check what type of analysis we got
      const analysis = result.data.analysis;
      console.log('📊 Analysis Type:', typeof analysis);
      console.log('📏 Analysis Length:', typeof analysis === 'string' ? analysis.length + ' characters' : 'Object with ' + Object.keys(analysis).length + ' keys');
      
      if (typeof analysis === 'object' && analysis !== null) {
        console.log('\n🎉 COMPREHENSIVE BUSINESS REPORT STRUCTURE DETECTED!');
        console.log('-'.repeat(50));
        
        // Check each main section
        const sections = [
          'business_overview',
          'market_research', 
          'launch_and_scale',
          'capital_raising',
          'reddit_validation'
        ];
        
        sections.forEach(section => {
          if (analysis[section]) {
            console.log(`✅ ${section.replace('_', ' ').toUpperCase()}: Present`);
            
            // Show key metrics for each section
            if (section === 'business_overview') {
              console.log(`   💰 Monetization strategies: ${analysis[section].monetization_strategies?.length || 0}`);
              console.log(`   ⚠️  Risk factors: ${analysis[section].potential_risks?.length || 0}`);
              console.log(`   🎯 Value prop: ${analysis[section].core_value_proposition ? 'Generated' : 'Missing'}`);
            }
            
            if (section === 'market_research') {
              console.log(`   🏢 Competitors: ${analysis[section].competitive_analysis?.length || 0}`);
              console.log(`   📊 Market size: ${analysis[section].market_size ? 'Calculated' : 'Missing'}`);
              console.log(`   👥 Customer segments: ${analysis[section].customer_segments?.length || 0}`);
            }
            
            if (section === 'launch_and_scale') {
              console.log(`   ⏱️  MVP roadmap: ${analysis[section].mvp_roadmap?.length || 0} milestones`);
              console.log(`   👨‍💼 Hiring plan: ${analysis[section].hiring_roadmap?.length || 0} roles`);
              console.log(`   🎨 Marketing tactics: ${analysis[section].guerrilla_marketing?.length || 0} ideas`);
              console.log(`   💻 Tech stack: ${analysis[section].tech_stack ? 'Recommended' : 'Missing'}`);
            }
            
            if (section === 'capital_raising') {
              console.log(`   🎤 Elevator pitch: ${analysis[section].elevator_pitch ? 'Generated' : 'Missing'}`);
              console.log(`   📊 Pitch deck: ${analysis[section].pitch_deck_outline?.length || 0} slides`);
              console.log(`   💸 Funding requirements: ${analysis[section].funding_required ? 'Calculated' : 'Missing'}`);
            }
            
            if (section === 'reddit_validation') {
              console.log(`   🌐 Communities: ${analysis[section].communities_analyzed?.length || 0}`);
              console.log(`   📊 Posts analyzed: ${analysis[section].total_posts_analyzed || 0}`);
              console.log(`   ⭐ Validation score: ${analysis[section].market_validation_score || 'N/A'}/10`);
            }
            
          } else {
            console.log(`❌ ${section.replace('_', ' ').toUpperCase()}: Missing`);
          }
        });
        
        console.log('\n🎯 SAMPLE INSIGHTS:');
        if (analysis.business_overview?.core_value_proposition) {
          console.log('💡 Value Proposition:', analysis.business_overview.core_value_proposition.substring(0, 150) + '...');
        }
        
        if (analysis.launch_and_scale?.guerrilla_marketing?.[0]) {
          console.log('🎨 Marketing Idea:', analysis.launch_and_scale.guerrilla_marketing[0]);
        }
        
        if (analysis.capital_raising?.elevator_pitch) {
          console.log('🎤 Elevator Pitch:', analysis.capital_raising.elevator_pitch.substring(0, 150) + '...');
        }
        
      } else {
        console.log('\n⚠️  OLD FORMAT DETECTED - Analysis returned as text');
        console.log('📝 Preview:', analysis.substring(0, 300) + '...');
      }
      
      console.log('\n📱 REDDIT DATA:');
      console.log(`🎯 Subreddits: [${(result.data.selectedSubreddits || []).join(', ')}]`);
      console.log(`📊 Posts Retrieved: ${(result.data.redditPosts || []).length}`);
      
      if (result.data.redditPosts && result.data.redditPosts.length > 0) {
        console.log(`📝 Sample Post: "${result.data.redditPosts[0].title.substring(0, 100)}..."`);
      }
      
    } else {
      console.log(`❌ ANALYSIS FAILED: ${result.error || 'Unknown error'}`);
      if (result.debug) {
        console.log('🔍 Debug Info:', result.debug);
      }
    }
    
  } catch (error) {
    console.log(`❌ REQUEST ERROR: ${error.message}`);
    console.error('Full error:', error);
  }
  
  console.log('\n' + '='.repeat(80));
}

testComprehensiveBusinessValidation().catch(console.error);