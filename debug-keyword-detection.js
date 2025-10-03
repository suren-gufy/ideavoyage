// Test keyword detection logic
const testIdeas = [
  "Blockchain-based voting system for elections",
  "Video game streaming platform with rewards", 
  "Medical appointment booking system",
  "Real estate investment calculator app"
];

function testKeywordDetection(idea) {
  console.log(`\n🎯 Testing: "${idea}"`);
  
  // Tokenize like the real system
  const tokens = idea
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.replace(/-/g, ''));
    
  console.log(`📝 Tokens: [${tokens.join(', ')}]`);
  
  // Test key detection flags
  const isCrypto = tokens.some(t => ['crypto','cryptocurrency','bitcoin','ethereum','blockchain','wallet','defi','nft','token','coin'].includes(t));
  const isGaming = tokens.some(t => ['game','gaming','gamer','esports','stream','twitch','discord','tournament','console'].includes(t));
  const isHealth = tokens.some(t => ['health','healthy','nutrition','diet','meal','food','fitness','wellness','medical','vitamin','supplement','exercise','meditation','mindfulness','mental','therapy','stress','anxiety'].includes(t));
  const isRealEstate = tokens.some(t => ['real','estate','property','rent','lease','apartment','house','landlord','mortgage'].includes(t));
  const isTech = tokens.some(t => ['app','software','platform','tech','digital','web','mobile','saas','api','cloud','database'].includes(t));
  const isMusic = tokens.some(t => ['music','song','audio','sound','instrument','band','artist','streaming','spotify'].includes(t));
  
  console.log(`🔍 Detection Results:`);
  console.log(`   Crypto: ${isCrypto}`);
  console.log(`   Gaming: ${isGaming}`);
  console.log(`   Health/Medical: ${isHealth}`);
  console.log(`   Real Estate: ${isRealEstate}`);
  console.log(`   Tech: ${isTech}`);
  console.log(`   Music: ${isMusic}`);
}

testIdeas.forEach(testKeywordDetection);