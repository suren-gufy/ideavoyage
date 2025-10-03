const fs = require('fs');

console.log('🔧 Fixing OpenAI calls in routes.ts...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Before: Found', (content.match(/openai\.chat\.completions\.create/g) || []).length, 'OpenAI calls');

// Replace all OpenAI calls with createCompletion
content = content.replace(/openai\.chat\.completions\.create/g, 'createCompletion');

console.log('📊 After: Found', (content.match(/openai\.chat\.completions\.create/g) || []).length, 'OpenAI calls');
console.log('📊 After: Found', (content.match(/createCompletion/g) || []).length, 'createCompletion calls');

fs.writeFileSync(filePath, content);

console.log('✅ Fixed all OpenAI calls in routes.ts');