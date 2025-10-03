// Debug single idea analysis
const API_URL = 'https://ideavoyage-jz3y6ziso-surendhars-projects-15fcb9f7.vercel.app/api';

async function debugSingleIdea() {
  const idea = 'designer todo list';
  console.log(`🔍 Debugging: "${idea}"`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea })
    });
    
    const data = await response.json();
    
    console.log('📊 Full response keys:', Object.keys(data));
    console.log('📊 Data source:', data.data_source);
    console.log('📊 Analysis confidence:', data.analysis_confidence);
    console.log('📊 Mode:', data.mode);
    console.log('📊 Debug data:', data.debug);
    console.log('📊 Evidence:', data.evidence);
    console.log('📊 Notes:', data.notes);
    
    // Check subreddits used
    console.log('🎯 Subreddits from evidence:', data.evidence?.subreddits_used);
    console.log('📝 Sample posts:', data.evidence?.sample_reddit_posts?.length || 0);
    
    // Check if perplexity is working
    console.log('🔥 Perplexity available:', data.debug?.perplexity_available);
    console.log('🔥 Enriched:', data.debug?.enriched);
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSingleIdea();