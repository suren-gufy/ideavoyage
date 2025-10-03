// Simple test for crypto wallet analysis
const https = require('https');

const cryptoWalletIdea = "A user-friendly crypto wallet for mainstream adoption";

const data = JSON.stringify({
  idea: cryptoWalletIdea,
  analysisType: 'complete'
});

const options = {
  hostname: 'ideavoyage-85vepuu1p-surendhars-projects-15fcb9f7.vercel.app',
  port: 443,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing crypto wallet idea...');
console.log(`💡 Idea: "${cryptoWalletIdea}"`);
console.log('🔍 Expected: Should get crypto subreddits like CryptoCurrency, Bitcoin, ethereum');
console.log('❌ Problem: Was getting finance subreddits like personalfinance, investing\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      
      if (result && result.analysis) {
        const subreddits = result.analysis.selectedSubreddits || [];
        const painPoints = result.analysis.painPoints || [];
        const redditPosts = result.analysis.redditDiscussions || [];

        console.log('📍 SELECTED SUBREDDITS:');
        subreddits.forEach(sub => console.log(`   - r/${sub}`));
        
        console.log(`\n📝 PAIN POINTS FOUND: ${painPoints.length}`);
        if (painPoints.length > 0) {
          console.log(`   First: "${painPoints[0].title || painPoints[0]}"`);
        }
        
        console.log(`\n🔍 REDDIT POSTS: ${redditPosts.length}`);
        if (redditPosts.length > 0) {
          console.log(`   Sample: "${redditPosts[0].title || 'No title'}"`);
        }

        // Check if we got crypto subreddits instead of finance
        const cryptoSubs = ['CryptoCurrency', 'Bitcoin', 'ethereum', 'CryptoMarkets', 'defi', 'NFT'];
        const financeSubs = ['personalfinance', 'investing', 'financialindependence'];
        
        const hasCrypto = subreddits.some(sub => cryptoSubs.includes(sub));
        const hasFinance = subreddits.some(sub => financeSubs.includes(sub));
        
        console.log('\n🎯 ANALYSIS RESULT:');
        if (hasCrypto && !hasFinance) {
          console.log('✅ SUCCESS! Got crypto subreddits, no generic finance ones');
        } else if (hasCrypto && hasFinance) {
          console.log('⚠️  MIXED! Got both crypto and finance subreddits');
        } else if (hasFinance && !hasCrypto) {
          console.log('❌ FAILED! Still getting finance subreddits instead of crypto');
        } else {
          console.log('🤷 UNCLEAR! Got other subreddits entirely');
        }
        
      } else {
        console.log('❌ No analysis data returned');
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response:', responseData.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();