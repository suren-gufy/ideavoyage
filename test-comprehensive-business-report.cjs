const fetch = require('node-fetch');

const API_URL = 'https://ideavoyage-i2z8xrg1f-surendhars-projects-15fcb9f7.vercel.app/api';

// Test comprehensive business validation report
const testIdea = "AI-powered plant care assistant that monitors soil moisture and sends notifications to your phone when plants need water or care";

async function testComprehensiveBusinessReport() {
  console.log('🏢 TESTING COMPREHENSIVE BUSINESS VALIDATION REPORT');
  console.log('=' .repeat(70));
  console.log(`📋 Testing Idea: "${testIdea}"`);
  console.log('-'.repeat(70));
  
  try {
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
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('✅ COMPREHENSIVE BUSINESS REPORT GENERATED');
      console.log('-'.repeat(70));
      
      // Check if we got the comprehensive structure
      const analysis = result.data.analysis;
      if (typeof analysis === 'object' && analysis !== null) {
        // Check for main sections
        const sections = [
          'business_overview',
          'market_research', 
          'launch_and_scale',
          'capital_raising',
          'reddit_validation'
        ];
        
        console.log('📊 REPORT SECTIONS ANALYSIS:');
        sections.forEach(section => {
          if (analysis[section]) {
            console.log(`  ✅ ${section.replace('_', ' ').toUpperCase()}: Present`);
            
            // Show sample content for each section
            if (section === 'business_overview' && analysis[section].monetization_strategies) {
              console.log(`     💰 Monetization strategies: ${analysis[section].monetization_strategies.length} found`);
            }
            if (section === 'market_research' && analysis[section].competitive_analysis) {
              console.log(`     🏆 Competitors analyzed: ${analysis[section].competitive_analysis.length} found`);
            }
            if (section === 'launch_and_scale' && analysis[section].mvp_roadmap) {
              console.log(`     🚀 MVP milestones: ${analysis[section].mvp_roadmap.length} defined`);
            }
            if (section === 'capital_raising' && analysis[section].funding_required) {
              console.log(`     💸 Funding breakdown: Available`);
            }
          } else {
            console.log(`  ❌ ${section.replace('_', ' ').toUpperCase()}: Missing`);
          }
        });
        
        console.log('\n📈 BUSINESS OVERVIEW HIGHLIGHTS:');
        if (analysis.business_overview) {
          console.log(`  🎯 Value Proposition: ${analysis.business_overview.core_value_proposition?.substring(0, 100)}...`);
          console.log(`  💰 Revenue Opportunities: ${analysis.business_overview.revenue_opportunities?.length || 0} identified`);
          console.log(`  ⚠️  Risk Factors: ${analysis.business_overview.potential_risks?.length || 0} identified`);
        }
        
        console.log('\n🎯 MARKET RESEARCH HIGHLIGHTS:');
        if (analysis.market_research) {
          console.log(`  📊 Market Size: ${analysis.market_research.market_size ? 'Calculated' : 'Missing'}`);
          console.log(`  🏢 Competitors: ${analysis.market_research.competitive_analysis?.length || 0} analyzed`);
          console.log(`  👥 Customer Segments: ${analysis.market_research.customer_segments?.length || 0} identified`);
        }
        
        console.log('\n🚀 LAUNCH STRATEGY HIGHLIGHTS:');
        if (analysis.launch_and_scale) {
          console.log(`  ⏱️  MVP Timeline: ${analysis.launch_and_scale.mvp_roadmap?.length || 0} milestones`);
          console.log(`  👨‍💼 Hiring Plan: ${analysis.launch_and_scale.hiring_roadmap?.length || 0} roles planned`);
          console.log(`  🎨 Marketing Ideas: ${analysis.launch_and_scale.guerrilla_marketing?.length || 0} tactics`);
        }
        
        console.log('\n💰 CAPITAL RAISING HIGHLIGHTS:');
        if (analysis.capital_raising) {
          console.log(`  🎤 Elevator Pitch: ${analysis.capital_raising.elevator_pitch ? 'Generated' : 'Missing'}`);
          console.log(`  📊 Pitch Deck: ${analysis.capital_raising.pitch_deck_outline?.length || 0} slides outlined`);
          console.log(`  💸 Funding Requirements: ${analysis.capital_raising.funding_required ? 'Calculated' : 'Missing'}`);
        }
        
        console.log('\n📱 REDDIT VALIDATION HIGHLIGHTS:');
        if (analysis.reddit_validation) {
          console.log(`  🌐 Communities: ${analysis.reddit_validation.communities_analyzed?.length || 0} analyzed`);
          console.log(`  📊 Posts Analyzed: ${analysis.reddit_validation.total_posts_analyzed || 0}`);
          console.log(`  ⭐ Validation Score: ${analysis.reddit_validation.market_validation_score || 'N/A'}/10`);
        }
        
      } else {
        console.log('⚠️  Analysis returned as text instead of structured JSON');
        console.log('📝 Preview:', typeof analysis === 'string' ? analysis.substring(0, 300) + '...' : 'Unknown format');
      }
      
      console.log(`\n📊 Additional Data:`);
      console.log(`  🎯 Subreddits Found: [${(result.data.selectedSubreddits || []).join(', ')}]`);
      console.log(`  📱 Reddit Posts: ${(result.data.redditPosts || []).length} retrieved`);
      
    } else {
      console.log(`❌ FAILED: ${result.error || 'Unknown error'}`);
      if (result.debug) {
        console.log('🔍 Debug info:', result.debug);
      }
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.error('Full error:', error);
  }
}

testComprehensiveBusinessReport().catch(console.error);