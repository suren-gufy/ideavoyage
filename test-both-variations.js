// Test both versions to understand the difference
const originalIdea = "a to do list for designer to keep track of there work";
const userIdea = "designer todo list";

console.log('=== ORIGINAL TEST IDEA ===');
testDetection(originalIdea);

console.log('\n=== USER ACTUAL IDEA ===');
testDetection(userIdea);

function testDetection(idea) {
  console.log('🔍 Testing:', idea);
  
  const tokens = idea.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
  
  console.log('📝 Tokens:', tokens);
  
  const isDesign = tokens.some(t => ['design','designer','designers','ui','ux','interface','prototype','figma','creative','brand','graphic','visual'].includes(t));
  const isProductivity = tokens.some(t => ['productivity','efficient','organize','manage','task','workflow','remote','collaboration'].includes(t));
  
  console.log('🎨 isDesign:', isDesign);
  console.log('⚡ isProductivity:', isProductivity);
  
  if (isDesign && isProductivity) {
    console.log('✅ COMBO: Design + Productivity');
    console.log('   → [userexperience, Design, web_design, productivity, Entrepreneur, startups]');
  } else if (isDesign) {
    console.log('✅ Design only');
    console.log('   → [userexperience, Design, web_design, Entrepreneur, startups, business]');
  } else if (isProductivity) {
    console.log('❌ Productivity only');
    console.log('   → [productivity, GetStudying, remotework, Entrepreneur, SideProject, business]');
  } else {
    console.log('❌ General');
    console.log('   → [startups, Entrepreneur, smallbusiness, SideProject, business, productivity]');
  }
}