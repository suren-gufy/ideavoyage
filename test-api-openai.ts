#!/usr/bin/env node
// @ts-nocheck

// Import the handler (treat as any to simplify local mock testing)
import handler from './api/index.js';

// NOTE: We intentionally avoid strict Vercel types here to keep this debug harness simple.

console.log('=== Testing API with OpenAI ===');

const mockReq: any = {
  method: 'POST',
  url: '/api/analyze',
  body: {
    idea: 'AI fitness coach that personalizes workouts',
    industry: 'Technology', 
    targetAudience: 'fitness enthusiasts'
  }
};

const mockRes: any = {
  _status: 200,
  status(code: number) { this._status = code; return this; },
  json(data: any) {
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
    
    return this;
  },
  send(body: any) { console.log('Raw send body:', body); return this; },
  setHeader() { return this; },
  end() { return this; }
};

async function main() {
  try {
    await handler(mockReq, mockRes);
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
  }
}

main().catch(console.error);