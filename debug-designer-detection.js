// Debug designer detection
const idea = "a to do list for designer to keep track of there work";

console.log('🔍 Testing designer detection for:', idea);

// Simulate the tokenization logic from the API
const tokens = idea.toLowerCase()
  .replace(/[^\w\s-]/g, ' ')
  .split(/\s+/)
  .filter(token => token.length > 2);

console.log('📝 Tokens:', tokens);

// Test the detection logic
const isDesign = tokens.some(t => ['design','designer','designers','ui','ux','interface','prototype','figma','creative','brand','graphic','visual'].includes(t));

console.log('🎨 isDesign detected:', isDesign);

// Show which tokens match
const matchingTokens = tokens.filter(t => ['design','designer','designers','ui','ux','interface','prototype','figma','creative','brand','graphic','visual'].includes(t));
console.log('✅ Matching design tokens:', matchingTokens);

// Show what subreddits should be assigned
if (isDesign) {
  console.log('🎯 Should get design subreddits: [userexperience, Design, web_design, Entrepreneur, startups, business]');
} else {
  console.log('❌ Will get general subreddits instead');
}