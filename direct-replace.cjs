const fs = require('fs');

console.log('🔧 Direct string replacement for OpenAI calls...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Before - OpenAI calls:', (content.match(/openai\.chat\.completions\.create/g) || []).length);

// Direct string replacement - most reliable approach
content = content.replace(/openai\.chat\.completions\.create/g, 'createCompletion');

console.log('📊 After - OpenAI calls:', (content.match(/openai\.chat\.completions\.create/g) || []).length);
console.log('📊 After - createCompletion calls:', (content.match(/createCompletion/g) || []).length);

fs.writeFileSync(filePath, content);
console.log('✅ Direct replacement completed!');