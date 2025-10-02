// Simple test for idea processing
fetch('http://localhost:5000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    idea: "an app for managment of small buisness inventery with ai recomendations",
    industry: "Technology",
    targetAudience: "Small business owners",
    country: "US"
  })
})
.then(response => response.json())
.then(data => {
  console.log('🎯 Analysis Result:');
  console.log('Original idea:', data.idea);
  
  if (data.idea_processing) {
    console.log('\n🧠 Idea Processing Results:');
    console.log('Enhanced:', data.idea_processing.enhanced_idea);
    console.log('Spelling corrections:', data.idea_processing.spelling_corrections);
    console.log('Business category:', data.idea_processing.business_category);
    console.log('Clarity score:', data.idea_processing.clarity_score);
    console.log('Extracted concepts:', data.idea_processing.extracted_concepts);
    console.log('Target market:', data.idea_processing.intent_analysis.target_market);
    console.log('Problem focus:', data.idea_processing.intent_analysis.problem_focus);
    console.log('Solution type:', data.idea_processing.intent_analysis.solution_type);
    console.log('Monetization hints:', data.idea_processing.intent_analysis.monetization_hints);
    console.log('Suggestions:', data.idea_processing.suggestions);
  } else {
    console.log('❌ No idea processing data found');
  }
  
  console.log('\n📊 Analysis Data:');
  console.log('Overall score:', data.overall_score);
  console.log('Data source:', data.data_source);
  console.log('Analysis confidence:', data.analysis_confidence);
})
.catch(error => {
  console.error('❌ Error:', error);
});