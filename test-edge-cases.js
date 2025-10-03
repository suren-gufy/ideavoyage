const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

// 🎯 EDGE CASE IDEAS - Really challenging ones
const edgeCaseIdeas = [
  "Quantum blockchain for interdimensional pet grooming",
  "A single word: Innovation",
  "Something that helps people with a very specific problem I can't describe",
  "Make money fast with this one weird trick",
  "Platform connecting introverted extroverts with extroverted introverts",
  "AI-powered solution for optimizing solutions using AI",
  "Revolutionary app that revolutionizes everything",
  "Service for people who need services but don't know what services they need"
];

async function testEdgeCases() {
  console.log('🔥 TESTING EDGE CASES - Most Challenging Ideas');
  console.log('=' .repeat(60));
  
  for (let i = 0; i < edgeCaseIdeas.length; i++) {
    const idea = edgeCaseIdeas[i];
    console.log(`\n🧪 Edge Case ${i + 1}: "${idea}"`);
    console.log('-'.repeat(40));
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idea: idea,
          analysisType: 'reddit_plus_ai' 
        }),
      });
      
      if (!response.ok) {
        console.log(`❌ API Error: ${response.status}`);
        continue;
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const subreddits = result.data.selectedSubreddits || [];
        console.log(`✅ HANDLED: Found communities [${subreddits.join(', ')}]`);
      } else {
        console.log(`❌ FAILED: ${result.error || 'No data returned'}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testEdgeCases().catch(console.error);