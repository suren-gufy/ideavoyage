const fs = require('fs');

console.log('🔧 Comprehensive OpenAI to Perplexity conversion...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Initial OpenAI calls found:', (content.match(/openai\.chat\.completions\.create/g) || []).length);

// Fix all remaining OpenAI calls with proper parameter structure
const fixes = [
  // Generic patterns for OpenAI calls
  {
    from: /const (\w+) = await openai\.chat\.completions\.create\(\{\s*model:\s*["'][^"']*["'],\s*messages:\s*(\[[^}]+\}[^}]*\]),\s*max_tokens:\s*(\d+),\s*temperature:\s*([\d.]+)\s*\}\);/gs,
    to: 'const $1 = await createCompletion($2, { max_tokens: $3, temperature: $4 });'
  },
  {
    from: /const (\w+) = await openai\.chat\.completions\.create\(\{\s*model:\s*["'][^"']*["'],\s*messages:\s*(\[[^}]+\}[^}]*\]),\s*max_completion_tokens:\s*(\d+),\s*temperature:\s*([\d.]+)\s*\}\);/gs,
    to: 'const $1 = await createCompletion($2, { max_tokens: $3, temperature: $4 });'
  },
  // More flexible pattern - just replace the function call part
  {
    from: /openai\.chat\.completions\.create\(\{/g,
    to: 'createCompletion(['
  }
];

// Apply fixes
for (const fix of fixes) {
  const before = (content.match(fix.from) || []).length;
  content = content.replace(fix.from, fix.to);
  const after = (content.match(fix.from) || []).length;
  if (before > after) {
    console.log(`✅ Applied fix: ${before - after} replacements`);
  }
}

// Now we need to fix the parameter structure for all createCompletion calls
// Find all createCompletion calls and fix their structure
const createCompletionPattern = /createCompletion\(\[\s*model:\s*["'][^"']*["'],\s*messages:\s*(\[[^\]]+\]),([^}]+)\}\);/gs;

content = content.replace(createCompletionPattern, (match, messages, params) => {
  // Extract parameters
  const maxTokensMatch = params.match(/max_(?:completion_)?tokens:\s*(\d+)/);
  const temperatureMatch = params.match(/temperature:\s*([\d.]+)/);
  
  const maxTokens = maxTokensMatch ? maxTokensMatch[1] : '2000';
  const temperature = temperatureMatch ? temperatureMatch[1] : '0.7';
  
  return `createCompletion(${messages}, { max_tokens: ${maxTokens}, temperature: ${temperature} });`;
});

// Simple pattern replacement for any remaining issues
content = content.replace(/openai\.chat\.completions\.create/g, 'createCompletion');

// Fix parameter structure issues
content = content.replace(/createCompletion\(\{\s*model:[^,]+,\s*messages:\s*(\[[^\]]+\]),[^}]+\}\)/gs, 'createCompletion($1)');

console.log('📊 Final OpenAI calls remaining:', (content.match(/openai\.chat\.completions\.create/g) || []).length);
console.log('📊 CreateCompletion calls found:', (content.match(/createCompletion/g) || []).length);

fs.writeFileSync(filePath, content);
console.log('✅ Comprehensive fix completed!');