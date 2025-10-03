// Test the fix for designer + productivity detection
const idea = "a to do list for designer to keep track of there work";

console.log('🔍 Testing FIXED detection for:', idea);

// Simulate the tokenization logic from the API
const tokens = idea.toLowerCase()
  .replace(/[^\w\s-]/g, ' ')
  .split(/\s+/)
  .filter(token => token.length > 2);

console.log('📝 Tokens:', tokens);

// Test all the detection logic
const isDesign = tokens.some(t => ['design','designer','designers','ui','ux','interface','prototype','figma','creative','brand','graphic','visual'].includes(t));
const isProductivity = tokens.some(t => ['productivity','efficient','organize','manage','task','workflow','remote','collaboration'].includes(t));

console.log('🎨 isDesign detected:', isDesign);
console.log('⚡ isProductivity detected:', isProductivity);

// Test the new combination logic
if (isDesign && isProductivity) {
  console.log('🎯 NEW COMBO: Design + Productivity → [userexperience, Design, web_design, productivity, Entrepreneur, startups]');
} else if (isDesign) {
  console.log('🎯 Design only → [userexperience, Design, web_design, Entrepreneur, startups, business]');
} else if (isProductivity) {
  console.log('❌ Productivity only → [productivity, GetStudying, remotework, Entrepreneur, SideProject, business]');
} else {
  console.log('❌ General → [startups, Entrepreneur, smallbusiness, SideProject, business, productivity]');
}