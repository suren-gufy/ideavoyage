#!/usr/bin/env node

console.log('=== Testing Simple OpenAI Call ===');

try {
  const OpenAIDep = await import('openai');
  const OpenAI = OpenAIDep.default;
  
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    timeout: 15000,
    maxRetries: 0
  });
  
  console.log('Making simple API call...');
  const start = Date.now();
  
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ 
      role: 'user', 
      content: 'Return JSON with 3 keywords about fitness apps: {"keywords": ["word1", "word2", "word3"]}' 
    }],
    temperature: 0.1,
    max_tokens: 100,
    response_format: { type: 'json_object' }
  });
  
  const duration = Date.now() - start;
  console.log(`✅ Call completed in ${duration}ms`);
  console.log('Response:', completion.choices[0]?.message?.content);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}