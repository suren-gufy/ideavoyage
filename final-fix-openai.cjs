const fs = require('fs');

console.log('🔧 Final fix for all remaining OpenAI calls...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📊 Before fix - OpenAI calls:', (content.match(/openai\.chat\.completions\.create/g) || []).length);

// Replace all OpenAI calls with createCompletion, preserving the structure
content = content.replace(
  /await openai\.chat\.completions\.create\(\{\s*model:\s*['"]['"]?[^'"]*['"]?,?\s*messages:\s*(\[[^\]]+\])[^}]*\}\)/gs,
  'await createCompletion($1)'
);

// Simple fallback replacement
content = content.replace(/openai\.chat\.completions\.create/g, 'createCompletion');

// Fix any remaining parameter structure issues
content = content.replace(
  /createCompletion\(\{\s*model:[^,]*,\s*messages:\s*(\[[^\]]+\])[^}]*\}\)/gs,
  'createCompletion($1)'
);

console.log('📊 After fix - OpenAI calls:', (content.match(/openai\.chat\.completions\.create/g) || []).length);
console.log('📊 After fix - createCompletion calls:', (content.match(/createCompletion/g) || []).length);

fs.writeFileSync(filePath, content);
console.log('✅ All OpenAI calls fixed!');