// Test note-taking app analysis
const https = require('https');

const noteTakingIdea = "AI-powered note-taking app for students and professionals";

const data = JSON.stringify({
  idea: noteTakingIdea
});

const options = {
  hostname: 'ideavoyage-2xa5ll34y-surendhars-projects-15fcb9f7.vercel.app',
  port: 443,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing note-taking app idea...');
console.log(`💡 Idea: "${noteTakingIdea}"`);
console.log('🔍 Expected: Should get education/productivity subreddits like r/studytips, r/productivity');
console.log('❓ Current: Getting r/technology instead\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      
      if (result && result.subreddits) {
        const subreddits = result.subreddits || [];
        const painPoints = result.pain_points || [];
        const redditPosts = result.evidence?.sample_reddit_posts || [];

        console.log('📍 SELECTED SUBREDDITS:');
        subreddits.forEach(sub => console.log(`   - r/${sub}`));
        
        console.log(`\n📝 PAIN POINTS FOUND: ${painPoints.length}`);
        if (painPoints.length > 0) {
          console.log(`   First: "${painPoints[0].title || painPoints[0]}"`);
        }
        
        console.log(`\n🔍 REDDIT POSTS: ${redditPosts.length}`);
        if (redditPosts.length > 0) {
          console.log('   Sample posts:');
          redditPosts.slice(0, 3).forEach((post, i) => {
            console.log(`   ${i+1}. "${post.title?.substring(0, 60)}..." - r/${post.subreddit}`);
            console.log(`      Link: https://reddit.com${post.permalink}`);
          });
        }

        // Check relevance
        const eduSubs = ['GetStudying', 'studytips', 'productivity', 'education', 'college', 'students'];
        const techSubs = ['technology', 'webdev', 'programming', 'SaaS'];
        
        const hasEdu = subreddits.some(sub => eduSubs.some(edu => edu.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(edu.toLowerCase())));
        const hasTech = subreddits.some(sub => techSubs.includes(sub));
        
        console.log('\n🎯 RELEVANCE ANALYSIS:');
        if (hasEdu && hasTech) {
          console.log('✅ GOOD MIX! Got both education and tech subreddits');
        } else if (hasEdu) {
          console.log('✅ GREAT! Got education-focused subreddits');
        } else if (hasTech) {
          console.log('⚠️  TECH ONLY - Missing education-specific communities');
        } else {
          console.log('❌ NEEDS IMPROVEMENT - Got unrelated subreddits');
        }
        
      } else {
        console.log('❌ No subreddits data returned');
        console.log('Response keys:', Object.keys(result));
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response first 500 chars:', responseData.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();