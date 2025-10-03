// Test specific idea: "a to do list for designer to keep track of there work"
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDesignerTodoIdea() {
  const idea = "a to do list for designer to keep track of there work";
  
  console.log('🧪 Testing idea:', idea);
  console.log('📡 Making API request...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idea: idea,
        industry: "Design",
        targetAudience: "Designers",
        country: "global"
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ API Response received!\n');
      console.log('📊 DATA SOURCE:', data.data_source);
      console.log('🔍 ANALYSIS CONFIDENCE:', data.analysis_confidence);
      console.log('📝 NOTES:', data.notes);
      console.log('\n🎯 IDENTIFIED SUBREDDITS:');
      
      if (data.subreddits && data.subreddits.length > 0) {
        data.subreddits.forEach((sub, index) => {
          console.log(`  ${index + 1}. r/${sub}`);
        });
      } else {
        console.log('  No subreddits found');
      }
      
      console.log('\n📈 EXAMPLE REDDIT POSTS:');
      if (data.debug && data.debug.sampleTitles) {
        data.debug.sampleTitles.slice(0, 3).forEach((title, index) => {
          console.log(`  ${index + 1}. "${title}"`);
        });
      }
      
      console.log('\n🔍 DEBUG INFO:');
      console.log('  Real posts fetched:', data.debug?.realPosts || 0);
      console.log('  Reddit OAuth used:', data.debug?.reddit_oauth_used || false);
      console.log('  OpenAI enriched:', data.debug?.enriched || false);
      console.log('  API version:', data.debug?.api_version || 'unknown');
      
      return data;
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    return null;
  }
}

testDesignerTodoIdea();