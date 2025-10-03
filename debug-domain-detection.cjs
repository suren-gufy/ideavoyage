// Debug why specific domains are falling back to generic tech
const ideas = [
  "meditation app",
  "Social platform for pet owners", 
  "Music collaboration platform with AI composition tools",
  "Digital art marketplace for independent artists"
];

ideas.forEach(idea => {
  console.log(`\n🔍 Debugging: "${idea}"`);
  const tokens = idea.toLowerCase().split(/\s+/).map(t => t.replace(/[^\w]/g, ''));
  console.log(`📝 Tokens: [${tokens.join(', ')}]`);
  
  // Check detection flags
  const isHealth = tokens.some(t => ['health','healthy','nutrition','diet','meal','food','fitness','wellness','medical','vitamin','supplement','exercise'].includes(t));
  const isMental = tokens.some(t => ['meditation','mindfulness','mental','therapy','stress','anxiety','calm','relax'].includes(t));
  const isPet = tokens.some(t => ['pet','dog','cat','animal','veterinary','grooming','training','care','breed','puppy','kitten'].includes(t));
  const isMusic = tokens.some(t => ['music','song','audio','sound','instrument','band','artist','streaming','spotify'].includes(t));
  const isArt = tokens.some(t => ['art','artist','creative','painting','drawing','sculpture','gallery','exhibition','craft'].includes(t));
  const isMarketing = tokens.some(t => ['marketing','advertising','campaign','brand','promotion','social','media','influencer','content'].includes(t));
  const isTech = tokens.some(t => ['app','software','platform','tech','digital','web','mobile','saas','api','cloud','database'].includes(t));
  
  console.log(`🎭 Detection results:`);
  console.log(`   Health/Wellness: ${isHealth}`);
  console.log(`   Mental/Meditation: ${isMental} (custom)`);
  console.log(`   Pet: ${isPet}`);
  console.log(`   Music: ${isMusic}`);
  console.log(`   Art: ${isArt}`);
  console.log(`   Marketing: ${isMarketing}`);
  console.log(`   Tech: ${isTech}`);
  
  console.log(`🎯 Priority analysis:`);
  if (isTech && isMarketing) {
    console.log('   ❌ Will match: Marketing + Tech combo → marketing subreddits');
  } else if (isTech) {
    console.log('   ❌ Will match: Tech focused → technology subreddits');
  } else {
    console.log('   ✅ Should match domain-specific');
  }
});

console.log(`\n💡 ISSUES FOUND:`);
console.log(`1. "meditation" keyword missing from health detection`);
console.log(`2. "social platform" triggering marketing instead of pets`);
console.log(`3. "platform" and "app" always triggering tech, overriding domain`);
console.log(`4. Need better priority for domain-specific over generic tech`);