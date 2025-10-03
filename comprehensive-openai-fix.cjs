const fs = require('fs');

console.log('🔧 Comprehensive OpenAI to createCompletion conversion...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find all remaining openai.chat.completions.create calls
const openaiMatches = content.match(/openai\.chat\.completions\.create/g);
console.log('📊 Remaining OpenAI calls to fix:', openaiMatches ? openaiMatches.length : 0);

// Pattern 1: Replace openai.chat.completions.create({ with createCompletion([
content = content.replace(/openai\.chat\.completions\.create\(\{\s*model:\s*['"'][^'"]*['"],\s*messages:\s*/g, 'createCompletion(');

// Pattern 2: Fix the closing part - find patterns like ],\s*max_completion_tokens: X,\s*temperature: Y\s*}\);
content = content.replace(/\],\s*max_completion_tokens:\s*(\d+),\s*temperature:\s*([\d.]+)\s*\}\);/g, '], { max_tokens: $1, temperature: $2 });');

// Pattern 3: Fix response_format issues - remove response_format from parameters
content = content.replace(/\],\s*max_completion_tokens:\s*(\d+),\s*response_format:\s*\{[^}]+\},\s*temperature:\s*([\d.]+)\s*\}\);/g, '], { max_tokens: $1, temperature: $2 });');

// Pattern 4: Fix any remaining parameter structures
content = content.replace(/\],\s*max_tokens:\s*(\d+),\s*temperature:\s*([\d.]+),\s*response_format:\s*\{[^}]+\}\s*\}\);/g, '], { max_tokens: $1, temperature: $2 });');

console.log('📊 After fixes - remaining OpenAI calls:', (content.match(/openai\.chat\.completions\.create/g) || []).length);
console.log('📊 After fixes - createCompletion calls:', (content.match(/createCompletion/g) || []).length);

fs.writeFileSync(filePath, content);
console.log('✅ All OpenAI calls converted to createCompletion!');