const fs = require('fs');

console.log('🔧 Fixing createCompletion parameter structure...');

const filePath = 'C:\\Users\\MY\\Downloads\\IdeaVoyage\\IdeaVoyage\\server\\routes.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix parameter structure - convert mixed parameters to proper options object
content = content.replace(
  /(\]\s*,)\s*max_completion_tokens:\s*(\d+),\s*(?:response_format:\s*\{[^}]+\},?\s*)?(?:temperature:\s*([\d.]+),?\s*)?\}\);/g,
  '], { max_tokens: $2, temperature: $3 || 0.7 });'
);

// Alternative pattern - just max_completion_tokens
content = content.replace(
  /(\]\s*,)\s*max_completion_tokens:\s*(\d+)\s*\}\);/g,
  '], { max_tokens: $2, temperature: 0.7 });'
);

// Another pattern - with response_format
content = content.replace(
  /(\]\s*,)\s*max_completion_tokens:\s*(\d+),\s*response_format:\s*\{[^}]+\}\s*\}\);/g,
  '], { max_tokens: $2, temperature: 0.7 });'
);

console.log('✅ Parameter structure fixed!');

fs.writeFileSync(filePath, content);