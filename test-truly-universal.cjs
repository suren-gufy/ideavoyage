// Use deployed API endpoint instead of local  
const API_URL = 'https://idea-voyage-git-main-pradeeps-projects-73b86e80.vercel.app/api';

// 🚀 20 COMPLETELY RANDOM IDEAS - No predefined categories!
const randomStartupIdeas = [
  "A smart umbrella that alerts you when it's going to rain",
  "Rental service for expensive kitchen appliances like stand mixers",
  "AI that writes personalized bedtime stories for children",
  "Subscription box for trying different types of international tea",
  "App that matches people based on their Netflix viewing history",
  "Service that pressure washes driveways using eco-friendly methods",
  "Platform connecting elderly people with tech-savvy teenagers for help",
  "Wearable device that tracks your posture throughout the day",
  "Marketplace for trading collectible trading cards online",
  "AI-powered plant care assistant that monitors soil moisture",
  "Service that creates custom workout playlists based on your heart rate",
  "App for coordinating carpools to concerts and events",
  "Platform that helps introverts practice small talk with AI",
  "Subscription service for trying artisanal hot sauces monthly",
  "Smart mirror that gives daily affirmations and motivation",
  "Service connecting travelers with locals for authentic food experiences",
  "App that reminds you to call your family members regularly",
  "Platform for sharing and discovering unique coffee brewing methods",
  "AI that predicts which houseplants will thrive in your specific home",
  "Service that creates personalized crossword puzzles from your interests"
];

async function testTrulyUniversalAnalysis() {
  console.log('🌟 TESTING TRULY UNIVERSAL REDDIT ANALYSIS');
  console.log('=' .repeat(60));
  
  let successCount = 0;
  let totalCount = randomStartupIdeas.length;
  
  for (let i = 0; i < randomStartupIdeas.length; i++) {
    const idea = randomStartupIdeas[i];
    console.log(`\n📝 Test ${i + 1}/${totalCount}: "${idea}"`);
    console.log('-'.repeat(50));
    
    try {
      // Use global fetch or require https module for Node.js
      const https = require('https');
      const postData = JSON.stringify({ 
        idea: idea,
        analysisType: 'reddit_plus_ai' 
      });
      
      const response = await new Promise((resolve, reject) => {
        const req = https.request(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: () => Promise.resolve(JSON.parse(data))
            });
          });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
      });

      
      if (!response.ok) {
        console.log(`❌ API Error: ${response.status}`);
        continue;
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const subreddits = result.data.selectedSubreddits || [];
        const posts = result.data.redditPosts || [];
        const analysis = result.data.analysis || '';
        
        console.log(`✅ SUCCESS:`);
        console.log(`   🎯 Found ${subreddits.length} subreddits: [${subreddits.join(', ')}]`);
        console.log(`   📊 Retrieved ${posts.length} Reddit posts`);
        console.log(`   🤖 AI analysis: ${analysis.length > 0 ? 'Generated' : 'Missing'}`);
        
        // Check if results are relevant (not just generic fallback)
        const isGeneric = subreddits.every(sub => 
          ['AskReddit', 'Entrepreneur', 'startups', 'technology', 'business'].includes(sub)
        );
        
        if (!isGeneric || posts.length > 0) {
          successCount++;
          console.log(`   🌟 QUALITY: Specific communities found or real posts retrieved`);
        } else {
          console.log(`   ⚠️  QUALITY: Only generic fallback communities`);
        }
      } else {
        console.log(`❌ FAILED: ${result.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🏆 FINAL RESULTS:`);
  console.log(`   ✅ Successful: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  console.log(`   ❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount >= totalCount * 0.8) {
    console.log(`\n🎉 EXCELLENT! System handles 80%+ of random ideas successfully`);
  } else if (successCount >= totalCount * 0.6) {
    console.log(`\n👍 GOOD! System handles 60%+ of random ideas`);
  } else {
    console.log(`\n⚠️  NEEDS IMPROVEMENT: Less than 60% success rate`);
  }
}

testTrulyUniversalAnalysis().catch(console.error);