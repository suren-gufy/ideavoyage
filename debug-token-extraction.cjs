// Debug token extraction for note-taking ideas
const noteIdea = "AI-powered note-taking app for students and professionals";

console.log('🔍 Debugging token extraction for note-taking idea:');
console.log(`💡 Original idea: "${noteIdea}"`);

// Simulate the same token extraction as the API
const idea = noteIdea.toLowerCase();
const tokens = idea.split(/\s+/).map(t => t.replace(/[^\w]/g, ''));

console.log(`📝 Extracted tokens: [${tokens.join(', ')}]`);

// Check each detection flag
const isHealth = tokens.some((t) => ['health','healthy','nutrition','diet','meal','food','fitness','wellness','medical','vitamin','supplement','exercise'].includes(t));
const isEdu = tokens.some((t) => ['education','learning','course','school','teach','study','student','students','university','training','tutorial','note','notes','notetaking','lecture','homework'].includes(t));
const isProductivity = tokens.some((t) => ['productivity','organize','manage','task','workflow','efficient','planner','calendar','todo','note','notes','notetaking'].includes(t));
const isTech = tokens.some((t) => ['app','software','platform','tech','digital','web','mobile','saas','api','cloud','database'].includes(t));
const isAI = tokens.some((t) => ['ai','aipowered','artificial','intelligence','machine','ml','gpt','neural','algorithm','chatbot'].includes(t));

console.log('\n🎯 Detection Results:');
console.log(`📚 isEdu: ${isEdu} (should be TRUE for students/note-taking)`);
console.log(`📋 isProductivity: ${isProductivity} (should be TRUE for note-taking)`);
console.log(`🤖 isAI: ${isAI} (TRUE because "ai-powered")`);
console.log(`💻 isTech: ${isTech} (TRUE because "app")`);
console.log(`🏥 isHealth: ${isHealth}`);

console.log('\n🔗 Priority Chain Analysis:');
if (isEdu && (isProductivity || isAI)) {
  console.log('✅ Should match: Education + Productivity/AI combo');
} else if (isEdu) {
  console.log('✅ Should match: Education focused');
} else if (isProductivity && (isAI || isTech)) {
  console.log('✅ Should match: Productivity + Tech combo');
} else if (isProductivity) {
  console.log('✅ Should match: Productivity focused');
} else if (isAI && isTech) {
  console.log('❌ Will match: AI + Technology combo (WRONG!)');
} else {
  console.log('❓ Will match something else');
}

// Test specific tokens that should trigger education (updated with compound words)
const educationTokens = ['education','learning','course','school','teach','study','student','students','university','training','tutorial','note','notes','notetaking','lecture','homework'];
const productivityTokens = ['productivity','organize','manage','task','workflow','efficient','planner','calendar','todo','note','notes','notetaking'];

console.log('\n🔍 Token Matching Details:');
console.log('Education tokens found:', tokens.filter(t => educationTokens.includes(t)));
console.log('Productivity tokens found:', tokens.filter(t => productivityTokens.includes(t)));
console.log('Tech tokens found:', tokens.filter(t => ['app','software','platform','tech','digital','web','mobile','saas','api','cloud','database'].includes(t)));
console.log('AI tokens found:', tokens.filter(t => ['ai','aipowered','artificial','intelligence','machine','ml','gpt','neural','algorithm','chatbot'].includes(t)));