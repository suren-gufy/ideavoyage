// Test the deployed API response structure
async function testDeployedAPI() {
  console.log('🧪 Testing deployed API...');
  
  const testData = {
    idea: "AI chatbot for customer support",
    industry: "AI",
    targetAudience: "small businesses"
  };
  
  try {
    const response = await fetch('https://ideavoyage-k7cdgy67x-surendhars-projects-15fcb9f7.vercel.app/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📡 Response Headers:`, [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS - Response received');
      console.log('📊 Data source:', data.data_source);
      console.log('📊 Analysis confidence:', data.analysis_confidence);
      console.log('📊 Notes:', data.notes);
      console.log('📊 Has idea field:', !!data.idea);
      console.log('📊 Has subreddits:', !!data.subreddits);
      console.log('📊 Has pain_points:', !!data.pain_points);
      console.log('📊 Response keys:', Object.keys(data));
      
      // Check if it's truly empty
      if (Object.keys(data).length === 0) {
        console.log('❌ EMPTY RESPONSE OBJECT');
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ HTTP Error:', errorText);
      return null;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return null;
  }
}

testDeployedAPI();