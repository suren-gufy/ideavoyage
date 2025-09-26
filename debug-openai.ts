#!/usr/bin/env node

console.log('=== OpenAI Debug Check ===');

console.log('Environment Variables:');
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false);

const hasOpenAIKey = !!process.env.OPENAI_API_KEY?.trim();
console.log('hasOpenAIKey:', hasOpenAIKey);

console.log('\nTrying to import OpenAI...');
try {
  const OpenAIDep = await import('openai');
  console.log('✅ OpenAI package imported successfully');
  
  if (hasOpenAIKey) {
    console.log('Trying to create OpenAI client...');
    const OpenAI = OpenAIDep.default;
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      timeout: 8000,
      maxRetries: 1
    });
    console.log('✅ OpenAI client created successfully');
    
    // Test a simple API call
    console.log('Testing API call...');
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "hello world" as JSON' }],
      temperature: 0.1,
      max_tokens: 50,
      response_format: { type: 'json_object' }
    });
    
    const response = completion.choices[0]?.message?.content || '{}';
    console.log('✅ API call successful:', response);
  } else {
    console.log('❌ No API key available for testing');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n=== End Debug ===');