#!/usr/bin/env node

/**
 * Test Scoring Variations
 * This script tests different startup ideas to verify scoring variety
 */

const testIdeas = [
  { idea: "AI chatbot for customer service", industry: "Technology", expected: "should be lower due to AI market saturation" },
  { idea: "Fitness tracking app with social features", industry: "Health", expected: "should be lower due to crowded fitness market" },
  { idea: "Real estate property management platform", industry: "Real Estate", expected: "should be higher due to market opportunities" },
  { idea: "Marketing automation SaaS", industry: "Marketing", expected: "should be lower due to oversaturated marketing tools" },
  { idea: "Educational platform for coding", industry: "Education", expected: "should be moderate, stable market" },
  { idea: "Unique IoT sensors for agriculture", industry: "Agriculture", expected: "should be higher, less saturated market" }
];

console.log('🧪 Testing Scoring Variations for Different Ideas');
console.log('='.repeat(60));

testIdeas.forEach((test, i) => {
  console.log(`\n${i+1}. ${test.idea}`);
  console.log(`   Industry: ${test.industry}`);
  console.log(`   Expected: ${test.expected}`);
});

console.log('\n📝 To test this:');
console.log('1. Run your IdeaVoyage app locally');
console.log('2. Test each idea above');
console.log('3. Verify scores are different and match expectations');
console.log('4. Look for detailed scoring breakdown in console logs');

console.log('\n🔍 Key things to verify:');
console.log('- AI/Fitness ideas get lower scores (6.0 or below)');
console.log('- Real estate ideas get higher scores (above 5.5)');
console.log('- Marketing tools get penalized (below 5.0)');
console.log('- Scores should range from 2.0 to 8.5 (not all 9.5!)');
console.log('- Market interest should be "high/medium/low" based on score');