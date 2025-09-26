#!/usr/bin/env node

import handler from './api/index.js';

console.log('=== Testing API with OpenAI ===');

const mockReq = {
  method: 'POST',
  url: '/api/analyze',
  body: {
    idea: 'AI fitness coach that personalizes workouts',
    industry: 'Technology', 
    targetAudience: 'fitness enthusiasts'
  }
};

const mockRes = {
  status: (code) => mockRes,
  json: (data) => {
    console.log(`\n📊 Response (${JSON.stringify(data).length} chars):`);
    console.log('Mode:', data.debug?.mode || 'unknown');
    console.log('OpenAI Available:', data.debug?.openai_available || false);
    console.log('Enriched:', data.debug?.enriched || false);
    console.log('Real Posts:', data.debug?.realPosts || 0);
    console.log('Overall Score:', data.overall_score);
    console.log('Keywords:', data.keywords?.slice(0,5).join(', '));
    
    if (data.debug?.enriched) {
      console.log('🎉 SUCCESS: AI enrichment is working!');
    } else {
      console.log('⚠️ WARNING: Only heuristic analysis was used');
    }
    
    return mockRes;
  },
  setHeader: () => {},
  end: () => {}
};

async function main() {
  try {
    await handler(mockReq, mockRes);
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
  }
}

main().catch(console.error);