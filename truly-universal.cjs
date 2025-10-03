const fs = require('fs');

console.log('🔧 Final comprehensive fix for all OpenAI issues...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Count initial OpenAI calls
const initialCount = (content.match(/openai\.chat\.completions\.create/g) || []).length;
console.log('📊 Initial OpenAI calls found:', initialCount);

// Method 1: Replace the function call
content = content.replace(/openai\.chat\.completions\.create/g, 'createCompletion');

// Method 2: Fix parameter structure issues
// Replace {\n        model: "gpt-4o",\n        messages: with ([
content = content.replace(/createCompletion\(\{\s*model:\s*["'][^"']*["'],\s*messages:\s*/g, 'createCompletion(');

// Method 3: Fix closing brackets - replace },\n      }); with ]);
content = content.replace(/\],\s*max_completion_tokens:\s*(\d+),\s*(?:response_format:\s*\{[^}]+\},\s*)?(?:temperature:\s*([\d.]+),?\s*)?\}\);/g, '], { max_tokens: $1, temperature: $2 || 0.7 });');

// Method 4: Clean up any remaining parameter issues
content = content.replace(/\],\s*max_completion_tokens:\s*(\d+),\s*response_format:\s*\{[^}]+\}\s*\}\);/g, '], { max_tokens: $1, temperature: 0.7 });');

// Method 5: Simple fallback for any remaining issues
content = content.replace(/\],\s*max_completion_tokens:\s*(\d+)\s*\}\);/g, '], { max_tokens: $1, temperature: 0.7 });');

// Count final OpenAI calls
const finalCount = (content.match(/openai\.chat\.completions\.create/g) || []).length;
const createCompletionCount = (content.match(/createCompletion/g) || []).length;

console.log('📊 Final OpenAI calls remaining:', finalCount);
console.log('📊 CreateCompletion calls found:', createCompletionCount);

fs.writeFileSync(filePath, content);

if (finalCount === 0) {
  console.log('✅ SUCCESS: All OpenAI calls have been converted to createCompletion!');
} else {
  console.log('⚠️  WARNING: Some OpenAI calls may still remain');
}